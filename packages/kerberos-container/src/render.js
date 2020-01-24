import ReactDOM from "react-dom";
import { handelReduxStore } from "kerberos-utils";
function render(app, root) {
    let appInstance = app();
    handelReduxStore(appInstance);
    ReactDOM.render(appInstance, root);
}
export default render;
