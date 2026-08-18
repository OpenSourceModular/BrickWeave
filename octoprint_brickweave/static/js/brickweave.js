$(function() {
    function detectPluginId() {
        const tabContainer = $('#generateBrickWeaveGcode').closest('[id^="tab_plugin_"], [id^="settings_plugin_"]');
        if (tabContainer.length) {
            const containerId = tabContainer.attr('id');
            const match = containerId.match(/^(?:tab|settings)_plugin_(.+)$/);
            if (match && match[1]) {
                return match[1];
            }
        }

        const scriptSrc = $('script[src*="brickweave.js"]').last().attr('src') || '';
        const srcMatch = scriptSrc.match(/\/plugin\/([^\/]+)\/static\/js\/brickweave\.js/);
        if (srcMatch && srcMatch[1]) {
            return srcMatch[1];
        }

        return 'brickweave';
    }

    function parseNumber(value, fallback) {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : fallback;
    }

    function updatePercentControl() {
        const style = $('#brickWeaveStyle').val();
        const percentControl = $('#brickWeavePercentControl');
        const percentInput = $('#brickWeavePercent');
        const repeatsControl = $('#brickWeaveRepeatsControl');
        const repeatsInput = $('#brickWeaveRepeats');

        if (style === 'Percent') {
            percentControl.show();
            repeatsControl.hide();
            percentInput.val(percentInput.val() || 50);
        } else if (style === 'Chevron') {
            percentControl.show();
            repeatsControl.show();
            percentInput.val(percentInput.val() || 25);
            repeatsInput.val(repeatsInput.val() || 4);
        } else {
            percentControl.hide();
            repeatsControl.hide();
        }
    }

    function buildGenerateUrls(pluginId) {
        const urls = [];

        if (window.OctoPrint && typeof OctoPrint.getBlueprintUrl === 'function') {
            urls.push(OctoPrint.getBlueprintUrl(pluginId) + 'generate_gcode');
        }

        urls.push((window.BASEURL || '/') + 'plugin/' + pluginId + '/generate_gcode');
        urls.push((window.API_BASEURL || '/api/') + 'plugin/' + pluginId);
        return urls;
    }

    function getCsrfToken() {
        if (window.OctoPrint && OctoPrint.options && OctoPrint.options.csrfToken) {
            return OctoPrint.options.csrfToken;
        }

        const cookieMatch = document.cookie.match(/(?:^|; )csrf_token=([^;]+)/);
        return cookieMatch ? decodeURIComponent(cookieMatch[1]) : '';
    }

    function tryGenerateAtUrl(url, payload) {
        const isApiCommand = /\/api\/plugin\//.test(url);
        const csrfToken = getCsrfToken();
        const requestData = isApiCommand ? $.extend({ command: 'generate_gcode' }, payload) : payload;

        return $.ajax({
            url: url,
            type: isApiCommand ? 'POST' : 'GET',
            contentType: isApiCommand ? 'application/json; charset=utf-8' : undefined,
            dataType: 'json',
            headers: csrfToken ? { 'X-CSRF-Token': csrfToken } : {},
            data: isApiCommand ? JSON.stringify(requestData) : requestData
        });
    }

    function postGenerateCommand(payload) {
        const pluginId = detectPluginId();
        const urls = buildGenerateUrls(pluginId);
        const deferred = $.Deferred();

        function attempt(index, lastError) {
            if (index >= urls.length) {
                deferred.reject(lastError);
                return;
            }

            tryGenerateAtUrl(urls[index], payload)
                .done(function(response) {
                    deferred.resolve(response);
                })
                .fail(function(xhr) {
                    if (xhr && xhr.status === 404) {
                        attempt(index + 1, xhr);
                        return;
                    }
                    deferred.reject(xhr);
                });
        }

        attempt(0, null);
        return deferred.promise();
    }

    $('#brickWeaveStyle').on('change', updatePercentControl);
    updatePercentControl();

    $('#generateBrickWeaveGcode').on('click', function() {
        const directionValue = $('input[name="brickWeaveDirection"]:checked').val() || 'LR';
        const style = $('#brickWeaveStyle').val() || '50-50';

        const payload = {
            style: style,
            percent_value: style === 'Percent' || style === 'Chevron'
                ? parseNumber($('#brickWeavePercent').val(), style === 'Percent' ? 50 : 25)
                : null,
            repeats: style === 'Chevron'
                ? parseNumber($('#brickWeaveRepeats').val(), 4)
                : null,
            number_of_divisions: parseNumber($('#brickWeaveDivisions').val(), 12),
            total_depth: parseNumber($('#brickWeaveTotalDepth').val(), 3),
            depth_increment: parseNumber($('#brickWeaveDepthIncrement').val(), 1),
            plunge_feedrate: parseNumber($('#brickWeavePlungeFeedrate').val(), 200),
            pull_off_distance: parseNumber($('#brickWeavePullOffDistance').val(), 3),
            cutter_head_width: parseNumber($('#brickWeaveCutterHeadWidth').val(), 6.35),
            length_of_brickweave: parseNumber($('#brickWeaveLength').val(), 25.4),
            direction: directionValue,
            direction_lr: directionValue === 'LR',
            direction_rl: directionValue === 'RL'
        };

        postGenerateCommand(payload)
            .done(function(response) {
                if (response && response.success) {
                    alert('Saved to uploads/' + response.filename);
                } else {
                    alert('Failed to generate gcode');
                }
            })
            .fail(function(xhr) {
                const status = xhr && xhr.status ? ('HTTP ' + xhr.status) : '';
                const jsonError = (xhr.responseJSON && xhr.responseJSON.error) ? xhr.responseJSON.error : '';
                const textError = xhr && xhr.responseText ? String(xhr.responseText).trim().slice(0, 500) : '';
                const fallback = xhr && xhr.statusText ? xhr.statusText : 'Request failed';
                const message = jsonError || textError || fallback;
                alert('Failed to generate gcode: ' + (status ? status + ' ' : '') + message);
            });
    });
});
