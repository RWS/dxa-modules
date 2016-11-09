interface IHelperContext { }

export class TestHelper {

    public static wrapWithContext(context: Object, contextTypes: React.ValidationMap<IHelperContext>, children: JSX.Element): JSX.Element {
        return React.createElement(React.createClass<{}, {}>({
            childContextTypes: contextTypes,
            getChildContext(): Object {
                return context;
            },
            render(): JSX.Element {
                return children;
            }
        }));
    }
}

export let testHelper = new TestHelper();
