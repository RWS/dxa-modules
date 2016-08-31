var Sdl;
(function (Sdl) {
    var DitaDelivery;
    (function (DitaDelivery) {
        var Tests;
        (function (Tests) {
            var Mocks;
            (function (Mocks) {
                var DataStore = (function () {
                    function DataStore() {
                    }
                    DataStore.prototype.getSitemapRoot = function (callback, mockData) {
                        callback(mockData.error, mockData.children);
                    };
                    DataStore.prototype.getSitemapItems = function (parentId, callback, mockData) {
                        callback(mockData.error, mockData.children);
                    };
                    DataStore.prototype.getPageInfo = function (pageId, callback, mockData) {
                        callback(mockData.error, mockData.info);
                    };
                    return DataStore;
                }());
                Mocks.DataStore = DataStore;
            })(Mocks = Tests.Mocks || (Tests.Mocks = {}));
        })(Tests = DitaDelivery.Tests || (DitaDelivery.Tests = {}));
    })(DitaDelivery = Sdl.DitaDelivery || (Sdl.DitaDelivery = {}));
})(Sdl || (Sdl = {}));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vY2tzL0RhdGFTdG9yZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxJQUFPLEdBQUcsQ0FxQ1Q7QUFyQ0QsV0FBTyxHQUFHO0lBQUMsSUFBQSxZQUFZLENBcUN0QjtJQXJDVSxXQUFBLFlBQVk7UUFBQyxJQUFBLEtBQUssQ0FxQzVCO1FBckN1QixXQUFBLEtBQUs7WUFBQyxJQUFBLEtBQUssQ0FxQ2xDO1lBckM2QixXQUFBLEtBQUssRUFBQyxDQUFDO2dCQUlqQztvQkFBQTtvQkErQkEsQ0FBQztvQkE3QlUsa0NBQWMsR0FBckIsVUFDSSxRQUEyRCxFQUMzRCxRQUdDO3dCQUNELFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDaEQsQ0FBQztvQkFFTSxtQ0FBZSxHQUF0QixVQUNJLFFBQWdCLEVBQ2hCLFFBQTRELEVBQzVELFFBR0M7d0JBQ0QsUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUNoRCxDQUFDO29CQUVNLCtCQUFXLEdBQWxCLFVBQ0ksTUFBYyxFQUNkLFFBQW1ELEVBQ25ELFFBR0M7d0JBQ0QsUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUM1QyxDQUFDO29CQUVMLGdCQUFDO2dCQUFELENBL0JBLEFBK0JDLElBQUE7Z0JBL0JZLGVBQVMsWUErQnJCLENBQUE7WUFFTCxDQUFDLEVBckM2QixLQUFLLEdBQUwsV0FBSyxLQUFMLFdBQUssUUFxQ2xDO1FBQUQsQ0FBQyxFQXJDdUIsS0FBSyxHQUFMLGtCQUFLLEtBQUwsa0JBQUssUUFxQzVCO0lBQUQsQ0FBQyxFQXJDVSxZQUFZLEdBQVosZ0JBQVksS0FBWixnQkFBWSxRQXFDdEI7QUFBRCxDQUFDLEVBckNNLEdBQUcsS0FBSCxHQUFHLFFBcUNUIiwiZmlsZSI6Im1vY2tzL0RhdGFTdG9yZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxubW9kdWxlIFNkbC5EaXRhRGVsaXZlcnkuVGVzdHMuTW9ja3Mge1xuICAgIGltcG9ydCBJU2l0ZW1hcEl0ZW0gPSBTZXJ2ZXIuTW9kZWxzLklTaXRlbWFwSXRlbTtcbiAgICBpbXBvcnQgSVBhZ2VJbmZvID0gU2RsLkRpdGFEZWxpdmVyeS5Nb2RlbHMuSVBhZ2VJbmZvO1xuXG4gICAgZXhwb3J0IGNsYXNzIERhdGFTdG9yZSBpbXBsZW1lbnRzIElEYXRhU3RvcmUge1xuXG4gICAgICAgIHB1YmxpYyBnZXRTaXRlbWFwUm9vdChcbiAgICAgICAgICAgIGNhbGxiYWNrOiAoZXJyb3I6IHN0cmluZywgY2hpbGRyZW46IElTaXRlbWFwSXRlbVtdKSA9PiB2b2lkLFxuICAgICAgICAgICAgbW9ja0RhdGE/OiB7XG4gICAgICAgICAgICAgICAgZXJyb3I6IHN0cmluZyxcbiAgICAgICAgICAgICAgICBjaGlsZHJlbjogSVNpdGVtYXBJdGVtW11cbiAgICAgICAgICAgIH0pOiB2b2lkIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKG1vY2tEYXRhLmVycm9yLCBtb2NrRGF0YS5jaGlsZHJlbik7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgZ2V0U2l0ZW1hcEl0ZW1zKFxuICAgICAgICAgICAgcGFyZW50SWQ6IHN0cmluZyxcbiAgICAgICAgICAgIGNhbGxiYWNrOiAoZXJyb3I6IHN0cmluZywgY2hpbGRyZW4/OiBJU2l0ZW1hcEl0ZW1bXSkgPT4gdm9pZCxcbiAgICAgICAgICAgIG1vY2tEYXRhPzoge1xuICAgICAgICAgICAgICAgIGVycm9yOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgY2hpbGRyZW4/OiBJU2l0ZW1hcEl0ZW1bXVxuICAgICAgICAgICAgfSk6IHZvaWQge1xuICAgICAgICAgICAgY2FsbGJhY2sobW9ja0RhdGEuZXJyb3IsIG1vY2tEYXRhLmNoaWxkcmVuKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBnZXRQYWdlSW5mbyhcbiAgICAgICAgICAgIHBhZ2VJZDogc3RyaW5nLFxuICAgICAgICAgICAgY2FsbGJhY2s6IChlcnJvcjogc3RyaW5nLCBpbmZvPzogSVBhZ2VJbmZvKSA9PiB2b2lkLFxuICAgICAgICAgICAgbW9ja0RhdGE/OiB7XG4gICAgICAgICAgICAgICAgZXJyb3I6IHN0cmluZyxcbiAgICAgICAgICAgICAgICBpbmZvPzogSVBhZ2VJbmZvXG4gICAgICAgICAgICB9KTogdm9pZCB7XG4gICAgICAgICAgICBjYWxsYmFjayhtb2NrRGF0YS5lcnJvciwgbW9ja0RhdGEuaW5mbyk7XG4gICAgICAgIH1cblxuICAgIH1cblxufVxuIl0sInNvdXJjZVJvb3QiOiIvdGVzdC8ifQ==
