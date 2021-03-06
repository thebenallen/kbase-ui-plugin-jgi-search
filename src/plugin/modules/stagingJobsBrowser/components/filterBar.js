define([
    'knockout-plus',
    'kb_common/html',
    './jobStatusFilter'
], function(
    ko,
    html,
    JobStatusFilterComponent
) {
    'use strict';

    var t = html.tag,
        span = t('span'),
        label = t('label'),
        div = t('div');

    function viewModel(params) {      
        return { 
            jobStatusFilter: params.search.jobStatusFilter
        };
    }

    var styles = html.makeStyles({
        filterLabel: {
            fontWeight: 'bold',
            color: 'gray',
            marginTop: '8px',
            fontSize: '80%'
        },
        component: {
            flex: '1 1 0px',
            display: 'flex',
            flexDirection: 'column'
        },
        searchArea: {
            flex: '0 0 50px',
        },
        activeFilterInput: {
            backgroundColor: 'rgba(209, 226, 255, 1)',
            color: '#000'
        },
        modifiedFilterInput: {
            backgroundColor: 'rgba(255, 245, 158, 1)',
            color: '#000'
        }
    });

    function buildFilterArea() {
        return div({
            class: 'form-inline',
            style: {
                display: 'inline-block'
            }
        }, [
            span({
                class: [styles.classes.filterLabel]
            }, 'Filters: '),
            
            
            div({
                style: {
                    display: 'inline-block',
                    marginLeft: '12px'
                }
            }, [
                label('Job Status '),
               
                ko.kb.komponent({
                    name: JobStatusFilterComponent.name(),
                    params: {
                        jobStatusFilter: 'jobStatusFilter'
                    }
                })
            ]),
           
        ]);
    }

    function template() {
        return buildFilterArea();
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