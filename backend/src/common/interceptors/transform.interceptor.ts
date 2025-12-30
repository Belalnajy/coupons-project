import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
  success: boolean;
  message?: string;
  total?: number;
  page?: number;
  totalPages?: number;
  limit?: number;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  Response<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        // If the data is already a paginated response object from our services
        if (
          data &&
          data.data &&
          Array.isArray(data.data) &&
          data.total !== undefined
        ) {
          return {
            success: true,
            data: data.data,
            total: data.total,
            page: data.page,
            totalPages: data.totalPages,
            limit: data.limit,
            message: data.message,
          };
        }

        // Standard response
        return {
          success: true,
          data: data,
          message: data?.message || undefined,
        };
      }),
    );
  }
}
