import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseWrapperInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // If the response is already wrapped with `data`, return as-is
        if (data && typeof data === 'object' && 'data' in data) {
          return data;
        }
        // Allow null/undefined to pass through (e.g., 204 No Content)
        if (data === null || data === undefined) {
          return data;
        }
        return { data };
      }),
    );
  }
}
