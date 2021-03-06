define([
    'knockout-plus',
    'kb_common/html',
    '../../help/components/searchHelp'
], function (
    ko,
    html,
    HelpComponent
) {
    'use strict';

    var t = html.tag,
        p = t('p'),
        img = t('img'),
        div = t('div'),
        span = t('span'),
        input = t('input');

    function viewModel(params) {
        // Params
        var logo = params.logo;

        // Own VM

        function doHelp() {
            params.search.showOverlay({
                name: HelpComponent.name(),
                params: {},
                viewModel: {}
            });
        }
       
        var showHistory = ko.observable(false);

        var searchHistory = params.search.searchHistory;

        // When it is updated by either of those methods, we save
        // it in the search history, and also forward the value to
        // the search query.

        // This is the search value the user has commited by clicking
        // the search button or pressing the Enter key.
       
        // This is the obervable in the actual search input.
        var searchControlValue = ko.observable().syncFrom(params.search.searchInput);

        function useFromHistory(data) {
            showHistory(false);
            searchControlValue(data);
            doRunSearch();
        }

        function doToggleHistory() {
            showHistory(!showHistory());
        }

        var searchInputClass = ko.pureComputed(function () {
            if (searchControlValue() !== params.search.searchInput()) {
                return styles.classes.modifiedFilterInput;
            }

            if (params.search.searchInput()) {
                return styles.classes.activeFilterInput;
            }

            return null;
        });

        function doClearInput() {
            params.search.searchInput('');
        }

        function doRunSearch() {
            // filter out nonsensical searches
            var query = searchControlValue();
            var emptyRe = /^\s*$/;
            if (emptyRe.test(query)) {
                return;
            }

            params.search.searchInput(query);
        }

        function doKeyUp(data, ev) {
            if (ev.key) {
                if (ev.key === 'Enter') {
                    doRunSearch();
                }
            } else if (ev.keyCode) {
                if (ev.keyCode === 13) {
                    doRunSearch();
                }
            }
        }

        // hack to ensure that clicking in side the history control does not close it!
        var historyContainerId = html.genId();

        function clickListener (ev) {
            // We don't want to handle clicks for the history control itself -- either
            // an item in the list or the button. The handlers for these things will do 
            // the right thing.
            var elementType = ev.target.getAttribute('data-type');
            if (['history-toggle-button', 'history-toggle-button-icon', 'history-item'].indexOf(elementType) == -1) {
                showHistory(false);
            }
            return true;
        }

        document.addEventListener('click', clickListener, true);

        function dispose() {
            if (clickListener) {
                document.removeEventListener('click', clickListener, true);
            }
        }

        return {
            logo: logo,
            // The top level search is included so that it can be
            // propagated.
            search: params.search,
            // And we break out fields here for more natural usage (or not??)
            searchControlValue: searchControlValue,
            searching: params.search.searching,

            showHistory: showHistory,
            doToggleHistory: doToggleHistory,

            useFromHistory: useFromHistory,
            searchHistory: searchHistory,
            searchInputClass: searchInputClass,

            historyContainerId: historyContainerId,

            // ACTIONS
            doHelp: doHelp,
            doRunSearch: doRunSearch,
            doKeyUp: doKeyUp,
            doClearInput: doClearInput,

            // LIFECYCLE
            dispose: dispose
        };
    }

    var styles = html.makeStyles({
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
        },
        historyContainer: {
            display: 'block',
            position: 'absolute',
            border: '1px silver solid',
            backgroundColor: 'rgba(255,255,255,0.9)',
            zIndex: '3',
            top: '100%',
            left: '0',
            right: '0'
        },
        historyItem: {
            css: {
                padding: '3px',
                cursor: 'pointer'
            },
            pseudo: {
                hover: {
                    backgroundColor: 'silver'
                }
            }
        },
        addonButton: {
            css: {
                color: 'black',
                cursor: 'pointer'
            },
            pseudo: {
                hover: {
                    backgroundColor: 'silver'
                },
                active: {
                    backgroundColor: 'gray',
                    color: 'white'
                }
            }
        },
        addonButtonDisabled: {
            css: {
                color: 'gray',
                cursor: 'normal'
            }
        }
    });

    function buildSearchBar() {
        /*
            Builds the search input area using bootstrap styling and layout.
        */
        return div({
            class: 'form'
        }, div({
            class: 'input-group'
        }, [
            '<!-- ko if: logo -->',
            div({
                class: 'input-group-addon ',
                style: {
                    padding: '0',
                    border: 'none',
                    backgroundColor: 'transparent'
                }
            }, img({
                dataBind: {
                    attr: {
                        src: 'logo'
                    }
                },
                style: {
                    display: 'inline',
                    height: '30px',
                    marginRight: '6px'
                }
            })),
            '<!-- /ko -->',
            div({
                class: 'input-group-addon ' + styles.classes.addonButton,
                style: {
                    borderRadius: '4px',
                    borderTopRightRadius: '0',
                    borderBottomRightRadius: '0',
                    paddingLeft: '8px',
                    paddingRight: '8px'
                },
                dataBind: {
                    click: 'doRunSearch'
                }
            }, span({
                style: {
                    display: 'inline-block',
                    width: '2em',
                    textAlign: 'center'
                }
            }, span({
                class: 'fa',
                style: {
                    fontSize: '100%',
                },
                dataBind: {
                    css: {
                        'fa-search': '!searching()',
                        'fa-spinner fa-pulse': 'searching()'
                    }
                }
            }))),
            div({
                class: 'form-control',
                style: {
                    display: 'inline-block',
                    width: '100%',
                    position: 'relative',
                    padding: '0',
                    border: 'none'
                }
            }, [
                input({
                    class: 'form-control',                   
                    dataBind: {
                        textInput: 'searchControlValue',
                        // value: 'searchInput',
                        hasFocus: true,
                        // css: 'searchInput() ? "' + styles.classes.activeFilterInput + '" : null',
                        css: 'searchInputClass',
                        event: {
                            keyup: 'doKeyUp'
                        }
                    },
                    placeholder: 'Search JGI Data'
                }),
                '<!-- ko if: showHistory -->',
                div({
                    class: styles.classes.historyContainer,
                    dataBind: {
                        attr: {
                            id: 'historyContainerId'
                        }
                    }
                }, [
                    '<!-- ko if: searchHistory().length > 0 -->',
                    '<!-- ko foreach: searchHistory -->',                    
                    div({
                        dataBind: {
                            text: '$data',
                            click: '$component.useFromHistory'
                        },
                        class: styles.classes.historyItem,
                        dataType: 'history-item'
                    }),
                    '<!-- /ko -->',
                    '<!-- /ko -->',
                    '<!-- ko ifnot: searchHistory().length > 0 -->',
                    p({
                        style: {
                            fontStyle: 'italic',
                            padding: '8px',
                            margin: '0px'
                        }
                    }, 'no items in history yet - Search!'),
                    '<!-- /ko -->',
                ]),
                '<!-- /ko -->'
            ]),
            div({
                class: 'input-group-addon ' + styles.classes.addonButton,
                dataBind: {
                    click: 'searchControlValue() ? doClearInput : null',
                    css: 'searchControlValue() ? "' + styles.classes.addonButton + '" : "' + styles.classes.addonButtonDisabled + '"'
                }
            }, span({
                class: 'fa fa-times'
            })),
            div({
                class: 'input-group-addon ' + styles.classes.addonButton,
                dataType: 'history-toggle-button',
                dataBind: {
                    click: 'doToggleHistory',
                    style: {
                        'background-color': 'showHistory() ? "silver" : null'
                    }
                }
            }, span({
                dataType: 'history-toggle-button-icon',
                class: 'fa fa-history'
            })),
            div({
                class: 'input-group-addon '  + styles.classes.addonButton,
                dataBind: {
                    click: 'doHelp'
                }
            }, span({
                class: 'fa fa-question'
            }))
        ]));
    }

    function template() {
        return div({}, [
            buildSearchBar()
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