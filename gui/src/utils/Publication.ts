import { IPublication } from "interfaces/Publication";

// const publications1 = this.service.get();
const DEFAULT_PUB: IPublication = {
    "id": "noid",
    "versionRef": "noid",
    "title": "Default",
    "language": "ru"
};

const getPubById = (publications: IPublication[], id: string): IPublication => {
    const foundPub = publications.find((pub: IPublication): boolean => pub.id === id);
    return foundPub || DEFAULT_PUB;
};

const getPubByLang = (publications: IPublication[]) => (hostPublicationId: string, language: string): IPublication | null => publications
    .filter((publication: IPublication): boolean => publication.versionRef === getPubById(publications, hostPublicationId).versionRef)
    .find((publication: IPublication): boolean => publication.language === language) || null;

export { getPubByLang };
