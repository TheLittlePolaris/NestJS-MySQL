import { HttpException, HttpStatus } from '@nestjs/common'
import { DeepPartial, FindConditions } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { EntityBase } from '../entity/base.entity'
import { BasePagination } from '../interfaces/pagination.interface'
import { EntityBaseRepository } from '../entity-repository/base.entity-repository'

export abstract class BaseService<T extends EntityBase, K extends EntityBaseRepository<T>> {
	constructor(private repository: K) {}

	public async createAndSave(data: DeepPartial<T>) {
		return await this.repository.saveOne(data)
	}

	async createRecord(data: DeepPartial<T>) {
		return await this.repository.create(data)
	}

	async getAll(pagination: BasePagination = {}) {
		const results = await this.repository.find(pagination).catch(null)
		if (!results) throw new HttpException('NotFound', HttpStatus.NOT_FOUND)
		return results
	}

	public async findOne(criteria: { [P in keyof DeepPartial<T>]?: T[P] }) {
		return await this.repository.findOne({ where: criteria })
	}

	public async updateOne<T>(id: number, updateData: { [P in keyof T]?: T[P] }) {
		return await this.repository.updateOne(id, updateData)
	}

	public async update(
		criteria: { [P in keyof FindConditions<T>]?: T[P] | any },
		updateData: QueryDeepPartialEntity<T>,
	) {
		return await this.repository.update(criteria, updateData).catch(null)
	}

	public async deleteById(id: number) {
		return await this.repository.delete(id)
	}
}
