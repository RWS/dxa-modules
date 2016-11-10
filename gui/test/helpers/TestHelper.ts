interface IHelperContext { }

export class TestHelper {

    public static wrapWithContext<P>(context: Object, contextTypes: React.ValidationMap<IHelperContext>): (children: JSX.Element) => React.ReactElement<P> {
        return (children: JSX.Element): React.ReactElement<P> => {
            return React.createElement(React.createClass<{}, {}>({
                childContextTypes: contextTypes,
                getChildContext(): Object {
                    return context;
                },
                render(): JSX.Element {
                    return children;
                }
            })) as React.ReactElement<P>;
        };
    }
}

export let testHelper = new TestHelper();
