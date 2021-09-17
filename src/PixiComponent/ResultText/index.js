import { PixiComponent } from "@inlet/react-pixi";
import { Text, TextStyle } from "pixi.js";

// ToDo TextStyle
export default PixiComponent('ResultText', {
    create: props => new Text('1', new TextStyle({

    }))
})