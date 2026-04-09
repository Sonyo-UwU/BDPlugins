/**
 * @name MessagesFetchLimit
 * @author Sonyo
 * @description Customize the messages fetch limit, defaults to the good old 50
 * @version 1.0.0
 */

module.exports = class MyPlugin {
    constructor(meta) {
        this.api = new BdApi(meta.name);
    }

    start() {
		const fetchMessagesModule = BdApi.Webpack.getByKeys('jumpToMessage', '_sendMessage', 'fetchMessages');
		
		this.api.Patcher.before(fetchMessagesModule, 'fetchMessages', (thisObject, args) => {
            if (args[0]?.limit != null)
                args[0].limit = 50;
        });
    }

    stop() {
		this.api.Patcher.unpatchAll();
    }
};
