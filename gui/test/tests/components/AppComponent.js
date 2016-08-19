/// <reference path="../../../src/components/App.tsx" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Sdl;
(function (Sdl) {
    var KcWebApp;
    (function (KcWebApp) {
        var Tests;
        (function (Tests) {
            var App = KcWebApp.Components.App;
            var AppComponent = (function (_super) {
                __extends(AppComponent, _super);
                function AppComponent() {
                    _super.apply(this, arguments);
                }
                AppComponent.prototype.runTests = function () {
                    var _this = this;
                    describe("App component tests.", function () {
                        var target = _super.prototype.createTargetElement.call(_this);
                        beforeAll(function () {
                            ReactDOM.render(React.createElement(App, null), target);
                        });
                        afterAll(function () {
                            var domNode = ReactDOM.findDOMNode(target);
                            ReactDOM.unmountComponentAtNode(domNode);
                            target.parentElement.removeChild(target);
                        });
                        it("renders", function () {
                            var domNode = ReactDOM.findDOMNode(target);
                            expect(domNode).not.toBeNull();
                            expect(domNode.querySelector(".sdl-activityindicator")).not.toBeNull("Could not find activity indicator.");
                        });
                    });
                };
                return AppComponent;
            }(SDL.Client.Test.TestBase));
            new AppComponent().runTests();
        })(Tests = KcWebApp.Tests || (KcWebApp.Tests = {}));
    })(KcWebApp = Sdl.KcWebApp || (Sdl.KcWebApp = {}));
})(Sdl || (Sdl = {}));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3RzL2NvbXBvbmVudHMvQXBwQ29tcG9uZW50LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSx3REFBd0Q7Ozs7OztBQUV4RCxJQUFPLEdBQUcsQ0FpQ1Q7QUFqQ0QsV0FBTyxHQUFHO0lBQUMsSUFBQSxRQUFRLENBaUNsQjtJQWpDVSxXQUFBLFFBQVE7UUFBQyxJQUFBLEtBQUssQ0FpQ3hCO1FBakNtQixXQUFBLEtBQUssRUFBQyxDQUFDO1lBRXZCLElBQU8sR0FBRyxHQUFHLG1CQUFVLENBQUMsR0FBRyxDQUFDO1lBRTVCO2dCQUEyQixnQ0FBd0I7Z0JBQW5EO29CQUEyQiw4QkFBd0I7Z0JBMEJuRCxDQUFDO2dCQXhCVSwrQkFBUSxHQUFmO29CQUFBLGlCQXVCQztvQkFyQkcsUUFBUSxDQUFDLHNCQUFzQixFQUFFO3dCQUM3QixJQUFNLE1BQU0sR0FBRyxnQkFBSyxDQUFDLG1CQUFtQixZQUFFLENBQUM7d0JBRTNDLFNBQVMsQ0FBQzs0QkFDTixRQUFRLENBQUMsTUFBTSxDQUFDLG9CQUFDLEdBQUcsT0FBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO3dCQUNwQyxDQUFDLENBQUMsQ0FBQzt3QkFFSCxRQUFRLENBQUM7NEJBQ0wsSUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQzs0QkFDN0MsUUFBUSxDQUFDLHNCQUFzQixDQUFDLE9BQU8sQ0FBQyxDQUFDOzRCQUN6QyxNQUFNLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQzt3QkFDN0MsQ0FBQyxDQUFDLENBQUM7d0JBRUgsRUFBRSxDQUFDLFNBQVMsRUFBRTs0QkFDVixJQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBZ0IsQ0FBQzs0QkFDNUQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQzs0QkFDL0IsTUFBTSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsb0NBQW9DLENBQUMsQ0FBQzt3QkFDL0csQ0FBQyxDQUFDLENBQUM7b0JBRVAsQ0FBQyxDQUFDLENBQUM7Z0JBRVAsQ0FBQztnQkFDTCxtQkFBQztZQUFELENBMUJBLEFBMEJDLENBMUIwQixHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBMEJsRDtZQUVELElBQUksWUFBWSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDbEMsQ0FBQyxFQWpDbUIsS0FBSyxHQUFMLGNBQUssS0FBTCxjQUFLLFFBaUN4QjtJQUFELENBQUMsRUFqQ1UsUUFBUSxHQUFSLFlBQVEsS0FBUixZQUFRLFFBaUNsQjtBQUFELENBQUMsRUFqQ00sR0FBRyxLQUFILEdBQUcsUUFpQ1QiLCJmaWxlIjoidGVzdHMvY29tcG9uZW50cy9BcHBDb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvQXBwLnRzeFwiIC8+XG5cbm1vZHVsZSBTZGwuS2NXZWJBcHAuVGVzdHMge1xuXG4gICAgaW1wb3J0IEFwcCA9IENvbXBvbmVudHMuQXBwO1xuXG4gICAgY2xhc3MgQXBwQ29tcG9uZW50IGV4dGVuZHMgU0RMLkNsaWVudC5UZXN0LlRlc3RCYXNlIHtcblxuICAgICAgICBwdWJsaWMgcnVuVGVzdHMoKTogdm9pZCB7XG5cbiAgICAgICAgICAgIGRlc2NyaWJlKGBBcHAgY29tcG9uZW50IHRlc3RzLmAsICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXQgPSBzdXBlci5jcmVhdGVUYXJnZXRFbGVtZW50KCk7XG5cbiAgICAgICAgICAgICAgICBiZWZvcmVBbGwoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBSZWFjdERPTS5yZW5kZXIoPEFwcC8+LCB0YXJnZXQpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgYWZ0ZXJBbGwoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBkb21Ob2RlID0gUmVhY3RET00uZmluZERPTU5vZGUodGFyZ2V0KTtcbiAgICAgICAgICAgICAgICAgICAgUmVhY3RET00udW5tb3VudENvbXBvbmVudEF0Tm9kZShkb21Ob2RlKTtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQodGFyZ2V0KTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGl0KFwicmVuZGVyc1wiLCAoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRvbU5vZGUgPSBSZWFjdERPTS5maW5kRE9NTm9kZSh0YXJnZXQpIGFzIEhUTUxFbGVtZW50O1xuICAgICAgICAgICAgICAgICAgICBleHBlY3QoZG9tTm9kZSkubm90LnRvQmVOdWxsKCk7XG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChkb21Ob2RlLnF1ZXJ5U2VsZWN0b3IoXCIuc2RsLWFjdGl2aXR5aW5kaWNhdG9yXCIpKS5ub3QudG9CZU51bGwoXCJDb3VsZCBub3QgZmluZCBhY3Rpdml0eSBpbmRpY2F0b3IuXCIpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmV3IEFwcENvbXBvbmVudCgpLnJ1blRlc3RzKCk7XG59XG4iXSwic291cmNlUm9vdCI6Ii90ZXN0LyJ9
