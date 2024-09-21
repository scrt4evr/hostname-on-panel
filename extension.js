import Clutter from 'gi://Clutter';
import GObject from 'gi://GObject';
import Shell from 'gi://Shell';
import St from 'gi://St';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';

function getKernelVersion() {
    let version = null;
    let content = null;

    try {
        content = Shell.get_file_contents_utf8_sync('/proc/version');
    } catch (error) {
        console.error(error);
        content = 'unknown';
        version = content;
    }
    

    if (content.indexOf('Debian') != -1) {
        /* Debian: get the version from the end of /proc/version:
         *
         *     $ cat /proc/version
         *     ... <much stuff here> ... #1 SMP Debian 5.4.6-1 (2019-12-27)
         */
        let elems = content.split(' ');
        if (elems.length > 2)
            version = elems[elems.length - 2];
    }

    if (version == null) {
        /* Otherwise: get the version from the beginning of /proc/version:
         *
         *     $ cat /proc/version
         *     Linux version 5.4.5-arch1-1.1 ... <much stuff here> ...
         */
        let elems = content.split(' ');
        if (elems.length > 3)
            version = elems[2];
    }

    return version;
}

let KernelButton = GObject.registerClass(
class KernelButton extends PanelMenu.Button {
    _init() {
        super._init(0.0, 'Kernel Indicator');

        let version = getKernelVersion();
        if (version == null) {
            version = 'Linux';
        }

        let label = new St.Label({ text: version,
                                   y_expand: true,
                                   y_align: Clutter.ActorAlign.CENTER });
        this.add_child(label);	
    }
});

export default class KernelIndicatorExtension {

    constructor() {
        this.kernelIndicatorButton = null;
    }

    enable() {
        this.kernelIndicatorButton = new KernelButton();
        Main.panel.addToStatusArea('kernel-indicator', this.kernelIndicatorButton);
    }

    disable() {
        this.kernelIndicatorButton.destroy();
        this.kernelIndicatorButton = null;
    }
}
