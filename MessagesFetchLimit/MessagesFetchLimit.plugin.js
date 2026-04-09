/**
 * @name MessagesFetchLimit
 * @author Sonyo
 * @description Customize the messages fetch limit, defaults to the good old 50
 * @version 1.1.0
 * @source https://github.com/Sonyo-UwU/BDPlugins/tree/main/MessagesFetchLimit
 */

module.exports = class MyPlugin {
    constructor(meta) {
        this.api = new BdApi(meta.name);
		this.settings = { overrideInitial: 50, overrideScroll: 50 };
    }

    start() {
		Object.assign(this.settings, this.api.Data.load('settings'));
		
		const fetchMessagesModule = BdApi.Webpack.getByKeys('jumpToMessage', '_sendMessage', 'fetchMessages');
		
		this.api.Patcher.before(fetchMessagesModule, 'fetchMessages', (thisObject, args) => {
            if (args[0]?.limit != null) {
				const limit = (args[0]?.before || args[0]?.after || args[0]?.jump) ? this.settings.overrideScroll : this.settings.overrideInitial;
				if (limit !== 0)
					args[0].limit = limit;
			}
        });
    }

    stop() {
		this.api.Patcher.unpatchAll();
    }
	
	getSettingsPanel() {
		return this.api.UI.buildSettingsPanel({
			onChange: (_, id, value) => {
				value = parseInt(value);
				if (value < 0)
					value = 0;
				else if (isNaN(value) || value > 50)
					value = 50;
				
                this.settings[id] = value;
                this.api.Data.save('settings', this.settings);
            },
			settings: [
				{ id: 'overrideInitial', name: 'Limit when loading channel', note: "max 50, set to 0 to use discord's default", type: 'number', value: this.settings.overrideInitial, min: 0, max: 50 },
				{ id: 'overrideScroll', name: 'Limit when scrolling or jumping to a message', note: "max 50, set to 0 to use discord's default", type: 'number', value: this.settings.overrideScroll, min: 0, max: 50 }
			]
		});
	}
};
