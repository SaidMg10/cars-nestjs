import { Injectable, Logger } from '@nestjs/common';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';
import { ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';
import { Request } from 'express';

import { Paginated } from '../interfaces/paginated.interface';
import { buildPaginationUrl } from 'src/common/helpers/url-builder.helper';

@Injectable()
export class PaginationProvider {
  constructor(private readonly logger: Logger) {
    this.logger = new Logger(PaginationProvider.name);
  }

  async paginateQuery<T extends ObjectLiteral>(
    paginationQuery: PaginationQueryDto,
    repositoryOrQueryBuilder: Repository<T> | SelectQueryBuilder<T>,
    request: Request,
    defaultLimit = 10,
  ): Promise<Paginated<T>> {
    const {
      limit = paginationQuery.limit ?? defaultLimit,
      page = paginationQuery.page ?? 1,
    } = paginationQuery;

    let results: T[];
    let totalItems: number;

    if (repositoryOrQueryBuilder instanceof Repository) {
      results = await repositoryOrQueryBuilder.find({
        skip: (page - 1) * limit,
        take: limit,
      });
      totalItems = await repositoryOrQueryBuilder.count();
    } else {
      totalItems = await repositoryOrQueryBuilder.getCount();
      results = await repositoryOrQueryBuilder
        .take(limit)
        .skip((page - 1) * limit)
        .getMany();
    }

    /**
     * Create the request URLs
     */
    const baseURL = request.protocol + '://' + request.headers.host + '/';
    const newUrl = new URL(request.url, baseURL);

    /**
     * Calculating page number
     */
    const totalPages = Math.ceil(totalItems / limit);
    const nextPage = page === totalPages ? page : page + 1;
    const previousPage = page === 1 ? page : page - 1;

    /**
     * Creating the URLs
     */
    const firstPageUrl = buildPaginationUrl(
      newUrl.origin,
      newUrl.pathname,
      limit,
      1,
    );
    const lastPageUrl = buildPaginationUrl(
      newUrl.origin,
      newUrl.pathname,
      limit,
      totalPages,
    );
    const currentPageUrl = buildPaginationUrl(
      newUrl.origin,
      newUrl.pathname,
      limit,
      page,
    );
    const nextPageUrl = buildPaginationUrl(
      newUrl.origin,
      newUrl.pathname,
      limit,
      nextPage,
    );
    const previousPageUrl = buildPaginationUrl(
      newUrl.origin,
      newUrl.pathname,
      limit,
      previousPage,
    );

    const finalResponse: Paginated<T> = {
      data: results,
      meta: {
        itemsPerPage: limit,
        totalItems,
        currentPage: page,
        totalPages,
      },
      links: {
        first: firstPageUrl,
        last: lastPageUrl,
        current: currentPageUrl,
        next: nextPageUrl,
        previous: previousPageUrl,
      },
    };
    return finalResponse;
  }
}
