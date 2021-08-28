class CatCategories{
    constructor(pvOptionCRUD, pvIdLanguageUser, pvIdCategory, pvShortDesc, pvLongDesc, pbStatus, pvUser, pvIP){
        this.pvOptionCRUD = pvOptionCRUD;
        this.pvIdLanguageUser = pvIdLanguageUser;
        this.pvIdCategory = pvIdCategory;
        this.pvShortDesc = pvShortDesc;
        this.pvLongDesc = pvLongDesc;
        this.pbStatus = pbStatus;
        this.pvUser = pvUser;
        this.pvIP = pvIP;
    }
}

module.exports = CatCategories;