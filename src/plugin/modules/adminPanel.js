define([
    'knockout-plus',
    'kb_common/html',
    './admin/components/main'
], function (
    ko,
    html,
    MainComponent
) {
    'use strict';

    function factory(config) {
        var runtime = config.runtime;
        var hostNode, container, rootComponent;

        function attach(node) {
            hostNode = node;
            // creates an unattached knockout component with kbase-ui integration
            // through the runtime object.
            rootComponent = ko.kb.createRootComponent(runtime, MainComponent.name());

            // now it becomes the direct child, avoiding any containers.
            container = hostNode.appendChild(rootComponent.node);
        }

        function start() {
            runtime.send('ui', 'setTitle', 'JGI Search - Admin');
            rootComponent.vm.running(true);
        }

        function stop() {
            rootComponent.vm.running(false);
        }

        function detach() {
            if (hostNode && container) {
                hostNode.removeChild(container);
            }
        }

        return {
            attach: attach,
            start: start,
            stop: stop,
            detach: detach
        };
    }

    return {
        make: factory
    };
});