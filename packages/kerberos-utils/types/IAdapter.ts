interface IAdapter {
    query(name:string):any;
    commander(event:string,payload:object):void;
    eventFilter(event:string):boolean;
    interceptor(interceptor:(event:string, payload:object)=>void):void;
}


export default IAdapter;