import Service from './service.js';

// Create the service.
class CollectionService extends Service {
  constructor (options) {
    super(options);

    if (!options || !options.db) {
      throw new Error('MongoDB DB options have to be provided');
    }
    this.db = options.db;
  }

  // Helper function to process stats object
  processObjectInfos (infos) {
    // console.log('Processing NS : ',infos)
    if (infos.ns) {
      const namespace = infos.ns?.split('.');
      if (namespace?.length > 1) {
        infos.name = namespace[1];
      }
      delete infos.ns;
    }
    /* if (infos.s.namespace.collection) {
      infos.name = infos.s.namespace.collection
    } */

    // In Mongo the collection name key is ns and prefixed by the db name, change to the more intuitive name just as in create

    return infos;
  }

  createImplementation (id, options) {
    return this.db.createCollection(id, options)
      .then(collection => collection.stats())
      .then(infos => this.processObjectInfos(infos));
  }

  getImplementation (id) {
    return Promise.resolve(this.db.collection(id));
  }

  listImplementation () {
    // console.log('Creating collection : ',this.db.listCollections().toArray());
    return this.db.listCollections().toArray();// this.db.collection.stats();//collections();
  }

  removeImplementation (item) {
    return item.drop();
  }
}

export default function init (options) {
  return new CollectionService(options);
}

init.Service = CollectionService;
