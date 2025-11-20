import { CategoryRepository } from '../ports/category.repository';

/**
 * Create category use case
 */
export class CreateCategoryUseCase {
  constructor(
    private categoryRepository: CategoryRepository = new (require('../../infrastructure/persistence/category.repository').CategoryRepositoryImpl)()
  ) {}

  async execute(data: {
    name: string;
    slug: string;
    description?: string;
    parentId?: string;
  }) {
    return this.categoryRepository.create(data);
  }
}

