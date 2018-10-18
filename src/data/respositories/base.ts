import { injectable, unmanaged } from 'inversify';
import { model, Model, Schema, Document } from 'mongoose';
import RepositoryErrors from '../errors/repository';
import { Repository, QueryOptions } from '../contracts/repository';

@injectable()
export default class BaseRepository<TModel extends Document>
  implements Repository<TModel> {
  model: Model<TModel>;
  entityName: string;
  constructor(
    @unmanaged() modelName: string,
    @unmanaged() schema: Schema,
    @unmanaged() entityName: string
  ) {
    this.model = model<TModel>(modelName, schema);
    this.entityName = entityName;
  }

  create(attributes: any): Promise<TModel> {
    return new Promise<TModel>((resolve, reject) => {
      this.model.create(attributes, (err, result) => {
        if (err)
          return reject(
            new RepositoryErrors.GenericDBError(
              'Could not create new ' + this.entityName
            )
          );
        return resolve(result);
      });
    });
  }

  /**
   * Finds a document by its ID
   * @param {string} id
   */
  byID(id: string, projections?: any): Promise<TModel> {
    return new Promise<TModel>((resolve, reject) => {
      this.model.findById(id, projections, (err, result) => {
        if (err) return reject(err);
        if (!result)
          return reject(
            new RepositoryErrors.ModelNotFoundError(
              'Could not find ' + this.entityName
            )
          );
        resolve(result);
      });
    });
  }

  /**
   * Find a document by any condtions or projections.
   * @param {QueryOptions} options - The query options to be applied to the query
   */
  byQuery(options: QueryOptions): Promise<TModel> {
    return new Promise<TModel>((resolve, reject) => {
      this.model
        .findOne(options.conditions, options.projections)
        .select(options.select)
        .exec((err, result) => {
          if (err) return reject(err);
          if (!result)
            return reject(
              new RepositoryErrors.ModelNotFoundError(
                'Could not find ' + this.entityName
              )
            );
          resolve(result);
        });
    });
  }

  /**
   * Retrieves all documents in model
   * @param {QueryOptions} options - The query options to be applied on the query
   */
  all(options: QueryOptions): Promise<TModel[]> {
    return new Promise<TModel[]>((resolve, reject) => {
      this.model
        .find(
          { ...options.conditions, deleted_at: undefined },
          options.projections
        )
        .select(options.select)
        .exec((err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
    });
  }

  /**
   * Updates a document
   * @param {string} id - The id of the document to be updated
   * @param {any} data - The update to be applied to the document if found
   */
  update(id: string, data: any): Promise<TModel> {
    return new Promise<TModel>((resolve, reject) => {
      this.model.findById(id, (err, result) => {
        if (err) return reject(err);
        if (!result)
          return reject(
            new RepositoryErrors.ModelNotFoundError(
              'Could not find ' + this.entityName
            )
          );
        result.set(data);
        result.save((err, updatedDoc) => {
          if (err) return reject(err);
          resolve(updatedDoc);
        });
      });
    });
  }

  /**
   * Permanently deletes a document
   * @param {string} id
   */
  async delete(id: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.model.findByIdAndRemove(id, (err, result) => {
        if (err) return reject(err);

        if (!result)
          return reject(
            new RepositoryErrors.ModelNotFoundError(
              'Could not find ' + this.entityName
            )
          );

        resolve(true);
      });
    });
  }
}
