/*
    Display hostname on the Gnome Shell panel
    Developed on GNOME Shell 46. Probably also works with earlier versions.
    (c) Fabrício Santos 2024
    License: GPL v3
*/

import Clutter from 'gi://Clutter';
import GObject from 'gi://GObject';
import St from 'gi://St';
import GLib from 'gi://GLib';

import {Extension, gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';

const Indicator = GObject.registerClass(
class Indicator extends PanelMenu.Button {
    _init() {
        super._init(0.0, _('My Shiny Indicator'));

        const hostname = GLib.get_host_name();

        let label = new St.Label({ text: hostname,
                                   y_expand: true,
                                   y_align: Clutter.ActorAlign.CENTER });
        this.add_child(label);
    }
});

export default class HostnameOnPanel extends Extension {
    enable() {
        this._indicator = new Indicator();
        Main.panel.addToStatusArea(this.uuid, this._indicator);
    }

    disable() {
        this._indicator.destroy();
        this._indicator = null;
    }
}
