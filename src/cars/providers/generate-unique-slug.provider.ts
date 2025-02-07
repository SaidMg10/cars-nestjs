import { Injectable } from '@nestjs/common';
import { IsSlugExistsProvider } from './is-slug-exist.provider';

@Injectable()
export class GenerateUniqueSlugProvider {
  constructor(private readonly isSlugExistsProvider: IsSlugExistsProvider) {}

  async generateUniqueSlug(model: string, version: string): Promise<string> {
    const baseSlug = `${model}-${version}`.toLowerCase().replace(/\s+/g, '-');
    let uniqueSlug = baseSlug;
    let counter = 1;

    while (await this.isSlugExistsProvider.isSlugExists(uniqueSlug)) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }
    return uniqueSlug;
  }
}
