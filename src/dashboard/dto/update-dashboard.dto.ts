import { PartialType } from '@nestjs/mapped-types';
import { SearchDashboardDto } from './search-dashboard.dto';

export class UpdateDashboardDto extends PartialType(SearchDashboardDto) {}
