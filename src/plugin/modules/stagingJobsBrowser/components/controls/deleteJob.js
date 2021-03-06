define([
    'knockout-plus',
    'kb_common/html',
    '../../../lib/ui'
], function (
    ko,
    html,
    ui
) {
    'use strict';
    var t = html.tag,
        div = t('div'),
        button = t('button'),
        span = t('span');

    function viewModel(params) {
        function doDelete(data) {
            params.env.removeJob(data.jobMonitoringId);
        }
        return {
            doDelete: doDelete,
            status: params.row.status.value,
            jobMonitoringId: params.row.jobId.jobMonitoringId
        };
    }

    var styles = html.makeStyles({
        dangerButton: {
            css: {
                padding: '4px',
                backgroundColor: 'transparent',
                color: ui.bootstrapTextColor('muted'),
                opacity: '0.8'
            },
            pseudo: {
                hover: {
                    color: ui.bootstrapTextColor('danger'),
                    opacity: '1'
                },
                active: {
                    color: ui.bootstrapTextColor('danger'),
                    opacity: '1'
                }
            }
        },
    });

    function template() {
        return div({
            class: 'btn-group pull-right'
        }, [
            '<!-- ko if: status() === "completed" || status() === "error" || status() === "notfound" -->',
            button({
                class: 'btn pull-right ' + styles.classes.dangerButton,                
                dataBind: {
                    click: 'doDelete'
                }
            }, span({
                class: 'fa fa-times'
            })),
            '<!-- /ko -->'
        ]);
    }

    function component() {
        return {
            viewModel: viewModel,
            template: template(),
            stylesheet: styles.sheet
        };
    }

    return ko.kb.registerComponent(component);
});