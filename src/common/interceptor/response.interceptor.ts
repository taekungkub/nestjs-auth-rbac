// interceptors/response-transform.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

// แปลง createdAt และ updatedAt เป็น local time แบบ recursive
function convertDatesToLocal(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(convertDatesToLocal);
  } else if (obj && typeof obj === 'object') {
    const converted = {};
    for (const key in obj) {
      if (['createdAt', 'updatedAt'].includes(key) && obj[key]) {
        converted[key] = dayjs(obj[key])
          .tz('Asia/Bangkok')
          .format('YYYY-MM-DD HH:mm:ss');
      } else {
        converted[key] = convertDatesToLocal(obj[key]);
      }
    }
    return converted;
  }
  return obj;
}

@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (!data) return data;

        const convertedData = convertDatesToLocal(data.data ?? data);

        return {
          statusCode: 200,
          ...data,
          data: convertedData,
        };
      }),
    );
  }
}
