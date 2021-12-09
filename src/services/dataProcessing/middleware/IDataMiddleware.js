class DataPackage {
    data;
    passed;
    metadata;
    
    constructor(data){
        this.data = data;
        this.passed = true;
        this.metadata = {}; //Custom metadata attached on middlewares
    }
}

class IDataMiddleware {

    async init(){}

    /**
     * My function description
     * @param {DataPackage} data
     * @param {() => {}} next
     */
    async onDataFlow(data = new DataPackage(), next = () => {}){}
}

module.exports = { IDataMiddleware, DataPackage };