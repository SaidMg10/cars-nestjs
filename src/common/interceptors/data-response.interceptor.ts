import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, map } from 'rxjs';

@Injectable()
export class DataResponseInterceptor<T>
  implements NestInterceptor<T, { data: T }>
{
  constructor(private readonly configService: ConfigService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<{ data: T }> {
    return next.handle().pipe(
      map((data: T) => ({
        apiVersion: this.configService.get<string>('appConfig.apiVersion'),
        data: data,
      })),
    );
  }
}
