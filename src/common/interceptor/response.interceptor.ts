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
        if (!data) {
          return { statusCode: 200, data: null };
        }

        // ดึงข้อมูลหลัก
        const extractedData = data.data ?? data;

        // แปลงวันที่ภายในข้อมูล
        const convertedData = convertDatesToLocal(extractedData);

        // เตรียม response เบื้องต้น
        const response: any = {
          statusCode: 200,
          data: convertedData,
        };

        // แนบ field อื่น ๆ ที่มากับ response (เช่น count, totalPage, meta, etc.)
        if (data && typeof data === 'object' && 'data' in data) {
          Object.entries(data).forEach(([key, value]) => {
            if (key !== 'data') {
              response[key] = value;
            }
          });
        }

        return response;
      }),
    );
  }
}
