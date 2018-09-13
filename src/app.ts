// tslint:disable-next-line:no-implicit-dependencies
import 'pixi';
// tslint:disable-next-line:no-implicit-dependencies
import 'p2';
// tslint:disable-next-line:no-implicit-dependencies
import 'phaser';


import * as WebFontLoader from 'webfontloader';

import * as Assets from './assets';
import Boot from './states/boot';
import Preloader from './states/preloader';
import Title from './states/title';
import {LevelOne} from './states/levelOne';
import * as Utils from './utils/utils';

class App extends Phaser.Game {
    constructor(config: Phaser.IGameConfig) {
        super (config);

        this.state.add('boot', Boot);
        this.state.add('preloader', Preloader);
        this.state.add('title', Title);
        this.state.add('levelOne', LevelOne);

        this.state.start('boot');
    }
}

function startApp(): void {
    let gameWidth: number = DEFAULT_GAME_WIDTH;
    let gameHeight: number = DEFAULT_GAME_HEIGHT;

    if (SCALE_MODE === 'USER_SCALE') {
        const screenMetrics: Utils.ScreenMetrics = Utils.ScreenUtils.calculateScreenMetrics(gameWidth, gameHeight);

        gameWidth = screenMetrics.gameWidth;
        gameHeight = screenMetrics.gameHeight;
    }

    // There are a few more options you can set if needed, just take a look at Phaser.IGameConfig
    const gameConfig: Phaser.IGameConfig = {
        width: gameWidth,
        height: gameHeight,
        renderer: Phaser.AUTO,
        parent: '',
        resolution: 1
    };

    const app = new App(gameConfig);
}

window.onload = () => {
    let webFontLoaderOptions: any = null;
    const webFontsToLoad: string[] = GOOGLE_WEB_FONTS;

    if (webFontsToLoad.length > 0) {
        webFontLoaderOptions = (webFontLoaderOptions || {});

        webFontLoaderOptions.google = {
        };
    }

    if (Object.keys(Assets.CustomWebFonts).length > 0) {
        webFontLoaderOptions = (webFontLoaderOptions || {});

        webFontLoaderOptions.custom = {
            families: [],
            urls: []
        };

        for (const font in Assets.CustomWebFonts) {
            if (font && Assets.CustomWebFonts[font]){
                webFontLoaderOptions.custom.families.push(Assets.CustomWebFonts[font].getFamily());
                webFontLoaderOptions.custom.urls.push(Assets.CustomWebFonts[font].getCSS());
            }
        }
    }

    if (webFontLoaderOptions === null) {
        // Just start the game, we don't need any additional fonts
        startApp();
    } else {
        // Load the fonts defined in webFontsToLoad from Google Web Fonts, and/or any Local Fonts then start the game knowing the fonts are available
        webFontLoaderOptions.active = startApp;

        WebFontLoader.load(webFontLoaderOptions);
    }
};
