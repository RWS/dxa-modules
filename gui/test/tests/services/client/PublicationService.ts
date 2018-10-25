import { PublicationService } from "services/client/PublicationService";
import { TestBase } from "@sdl/models";
import { FakeXMLHttpRequest } from "test/mocks/XmlHttpRequest";
import { IWindow } from "interfaces/Window";

interface IXMLHttpRequestWindow extends Window {
    XMLHttpRequest: {};
}

class PublicationServiceInvalidatable extends PublicationService {
    public ivalidate(): void {
        PublicationService.PublicationsModel = undefined;
    }
}

class PublicationServiceTests extends TestBase {
    public runTests(): void {
        const win = window as IWindow;
        const mocksFlag = win.SdlDitaDeliveryMocksEnabled;
        const publicationService = new PublicationServiceInvalidatable();
        const publicationId = "1961702";

        describe(`Publication service tests.`, (): void => {
            beforeEach(() => {
                win.SdlDitaDeliveryMocksEnabled = true;
            });

            afterEach(() => {
                win.SdlDitaDeliveryMocksEnabled = mocksFlag;
            });

            it("returns a proper error when product families cannot be retrieved", (done: () => void): void => {
                // Put this test first, otherwise the publication would be already in the cache and the spy would not work
                const failMessage = "failure-retrieving-publications-families";
                spyOn(window as IXMLHttpRequestWindow, "XMLHttpRequest").and.callFake(
                    () => new FakeXMLHttpRequest(failMessage)
                );
                publicationService
                    .getProductFamilies()
                    .then(() => {
                        fail("An error was expected.");
                        done();
                    })
                    .catch(error => {
                        expect(error).toContain(failMessage);
                        done();
                    });
            });

            it("returns a proper error when publications cannot be retrieved", (done: () => void): void => {
                // Put this test first, otherwise the publication would be already in the cache and the spy would not work
                const failMessage = "failure-retrieving-publications";
                spyOn(window as IXMLHttpRequestWindow, "XMLHttpRequest").and.callFake(
                    () => new FakeXMLHttpRequest(failMessage)
                );
                publicationService
                    .getPublications()
                    .then(() => {
                        fail("An error was expected.");
                        done();
                    })
                    .catch(error => {
                        expect(error).toContain(failMessage);
                        done();
                    });
            });

            it("returns a proper error when publication cannot be retrieved", (done: () => void): void => {
                // Put this test first, otherwise the publication would be already in the cache and the spy would not work
                const failMessage = "failure-retrieving-publication-title";
                spyOn(window as IXMLHttpRequestWindow, "XMLHttpRequest").and.callFake(
                    () => new FakeXMLHttpRequest(failMessage)
                );
                publicationService
                    .getPublicationById(failMessage)
                    .then(() => {
                        fail("An error was expected.");
                        done();
                    })
                    .catch(error => {
                        expect(error).toContain(failMessage);
                        done();
                    });
            });

            it("can get product families", (done: () => void): void => {
                publicationService.ivalidate();
                publicationService
                    .getProductFamilies()
                    .then(families => {
                        expect(families).toBeDefined();
                        if (families) {
                            expect(families.length).toBe(7);
                            expect(families[1].title).toBe("Mobile Phones");
                        }
                        done();
                    })
                    .catch(error => {
                        fail(`Unexpected error: ${error}`);
                        done();
                    });
            });

            it("can get product families from memory", (done: () => void): void => {
                const spy = spyOn(window as IXMLHttpRequestWindow, "XMLHttpRequest").and.callThrough();
                publicationService
                    .getProductFamilies()
                    .then(families => {
                        expect(families).toBeDefined();
                        if (families) {
                            expect(families.length).toBe(7);
                            expect(families[1].title).toBe("Mobile Phones");
                            expect(spy).not.toHaveBeenCalled();
                        }
                        done();
                    })
                    .catch(error => {
                        fail(`Unexpected error: ${error}`);
                        done();
                    });
            });

            it("returns a proper error when release versions can not be retrieved", (done: () => void): void => {
                publicationService.getProductFamilies().then(families => {
                    publicationService.ivalidate();
                    const failMessage = "failure-retrieving-release-versions";
                    spyOn(window as IXMLHttpRequestWindow, "XMLHttpRequest").and.callFake(
                        () => new FakeXMLHttpRequest(failMessage)
                    );
                    publicationService
                        .getProductReleaseVersions(families[0].title)
                        .then(releaseVersions => {
                            fail("An error was expected.");
                            done();
                        })
                        .catch(error => {
                            expect(error).toContain(failMessage);
                            done();
                        });
                });
            });

            it("can get product release versions", (done: () => void): void => {
                publicationService.getProductFamilies().then(families => {
                    publicationService.ivalidate();
                    publicationService
                        .getProductReleaseVersions(families[2].title)
                        .then(releaseVersions => {
                            expect(releaseVersions).toBeDefined();
                            if (releaseVersions) {
                                expect(releaseVersions.length).toBe(1);
                                expect(releaseVersions[0].title).toBe("Penguins");
                            }
                            done();
                        })
                        .catch(error => {
                            fail(`Unexpected error: ${error}`);
                            done();
                        });
                });
            });

            it("can get product release versions from memory", (done: () => void): void => {
                const spy = spyOn(window as IXMLHttpRequestWindow, "XMLHttpRequest").and.callThrough();
                publicationService.getProductFamilies().then(families => {
                    publicationService
                        .getProductReleaseVersions(families[2].title)
                        .then(releaseVersions => {
                            expect(releaseVersions).toBeDefined();
                            if (releaseVersions) {
                                expect(releaseVersions.length).toBe(1);
                                expect(releaseVersions[0].title).toBe("Penguins");
                                expect(spy).not.toHaveBeenCalled();
                            }
                            done();
                        })
                        .catch(error => {
                            fail(`Unexpected error: ${error}`);
                            done();
                        });
                });
            });

            it("returns a proper error when product release versions for publication cannot be retrieved", (done: () => void): void => {
                publicationService.ivalidate();
                const failMessage = "failure-retrieving-product-release-versions-for-publication";
                spyOn(window as IXMLHttpRequestWindow, "XMLHttpRequest").and.callFake(
                    () => new FakeXMLHttpRequest(failMessage)
                );
                publicationService
                    .getProductReleaseVersionsByPublicationId(publicationId)
                    .then(() => {
                        fail("An error was expected.");
                        done();
                    })
                    .catch(error => {
                        expect(error).toContain(failMessage);
                        done();
                    });
            });

            it("can get product release versions for a publication id", (done: () => void): void => {
                publicationService.ivalidate();
                publicationService
                    .getProductReleaseVersionsByPublicationId(publicationId)
                    .then(releaseVersions => {
                        expect(releaseVersions).toBeDefined();
                        if (releaseVersions) {
                            expect(releaseVersions.length).toBe(3);
                            // TODO: Check when versions would be fixed
                            //expect(releaseVersions[0].title).toBe("MP 330");
                            //expect(releaseVersions[1].title).toBe("MP 330 2014");
                        }
                        done();
                    })
                    .catch(error => {
                        fail(`Unexpected error: ${error}`);
                        done();
                    });
            });

            it("can get product release versions for a publication id from memory", (done: () => void): void => {
                const spy = spyOn(window as IXMLHttpRequestWindow, "XMLHttpRequest").and.callThrough();
                publicationService
                    .getProductReleaseVersionsByPublicationId(publicationId)
                    .then(releaseVersions => {
                        expect(releaseVersions).toBeDefined();
                        if (releaseVersions) {
                            expect(releaseVersions.length).toBe(3);
                            // TODO: Check when versions would be fixed
                            // expect(releaseVersions[0].title).toBe("MP 330");
                            // expect(releaseVersions[1].title).toBe("MP 330 2014");
                            expect(spy).not.toHaveBeenCalled();
                        }
                        done();
                    })
                    .catch(error => {
                        fail(`Unexpected error: ${error}`);
                        done();
                    });
            });

            it("can get the publications", (done: () => void): void => {
                publicationService.ivalidate();
                publicationService
                    .getPublications()
                    .then(publications => {
                        expect(publications).toBeDefined();
                        if (publications) {
                            expect(publications.length).toBe(9);
                            expect(publications[6].title).toBe("User Guide");
                        }
                        done();
                    })
                    .catch(error => {
                        fail(`Unexpected error: ${error}`);
                        done();
                    });
            });

            it("can get the publications from memory", (done: () => void): void => {
                const spy = spyOn(window as IXMLHttpRequestWindow, "XMLHttpRequest").and.callThrough();
                publicationService
                    .getPublications()
                    .then(publications => {
                        expect(publications).toBeDefined();
                        if (publications) {
                            expect(publications.length).toBe(9);
                            expect(publications[6].title).toBe("User Guide");
                            expect(spy).not.toHaveBeenCalled();
                        }
                        done();
                    })
                    .catch(error => {
                        fail(`Unexpected error: ${error}`);
                        done();
                    });
            });

            it("can get a publication by id", (done: () => void): void => {
                publicationService.ivalidate();
                publicationService
                    .getPublicationById(publicationId)
                    .then(pub => {
                        expect(pub.title).toBe("User Guide");
                        done();
                    })
                    .catch(error => {
                        fail(`Unexpected error: ${error}`);
                        done();
                    });
            });

            it("can get a publication by id from memory", (done: () => void): void => {
                const spy = spyOn(window as IXMLHttpRequestWindow, "XMLHttpRequest").and.callThrough();
                publicationService
                    .getPublicationById(publicationId)
                    .then(pub => {
                        expect(pub.title).toBe("User Guide");
                        expect(spy).not.toHaveBeenCalled();
                        done();
                    })
                    .catch(error => {
                        fail(`Unexpected error: ${error}`);
                        done();
                    });
            });

            it("returns a proper error when a publication by id cannot be resolved", (done: () => void): void => {
                publicationService
                    .getPublicationById("does-not-exist")
                    .then(() => {
                        fail("An error was expected.");
                        done();
                    })
                    .catch(error => {
                        expect(error).toContain("does-not-exist");
                        done();
                    });
            });
        });

        describe(`Publication service tests for conditions`, (): void => {
            beforeEach(() => {
                win.SdlDitaDeliveryMocksEnabled = true;
            });

            afterEach(() => {
                win.SdlDitaDeliveryMocksEnabled = mocksFlag;
            });

            it("can get a publication conditions", (done: () => void): void => {
                publicationService.ivalidate();
                publicationService
                    .getConditions(publicationId)
                    .then(conditions => {
                        expect(Object.keys(conditions)).toEqual([
                            "MODEL",
                            "HEADSET",
                            "GPRS",
                            "LOUDSPEAKER",
                            "BLUETOOTH",
                            "GAMES"
                        ]);
                        done();
                    })
                    .catch(error => {
                        fail(`Unexpected error: ${error}`);
                    });
            });

            it("can get a publication by id from memory", (done: () => void): void => {
                const spy = spyOn(window as IXMLHttpRequestWindow, "XMLHttpRequest").and.callThrough();
                publicationService
                    .getConditions(publicationId)
                    .then(conditions => {
                        expect(Object.keys(conditions)).toEqual([
                            "MODEL",
                            "HEADSET",
                            "GPRS",
                            "LOUDSPEAKER",
                            "BLUETOOTH",
                            "GAMES"
                        ]);
                        expect(spy).not.toHaveBeenCalled();
                        done();
                    })
                    .catch(error => {
                        fail(`Unexpected error: ${error}`);
                    });
            });

            it("returns a proper error when a publication by id cannot be resolved", (done: () => void): void => {
                publicationService
                    .getConditions("does-not-exist")
                    .then(conditions => {
                        fail("An error was expected.");
                    })
                    .catch(error => {
                        expect(error).toContain("does-not-exist");
                        done();
                    });
            });
        });
    }
}

new PublicationServiceTests().runTests();
