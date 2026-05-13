let config = {
    parent: 'root',
    type: Phaser.WEBGL,
    backgroundColor: '#7c8cdc',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1080,
        height: 1920
    },
    physics: {
        default: 'matter',
        matter: {
            gravity: {
                y: 5
            },
            // debug: {
            //     lineThickness: 4,
            // }
        }
    },
    scene: [LoadGo, Level0, Level1]
}

let game = new Phaser.Game(config)