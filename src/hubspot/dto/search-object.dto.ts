export class SearchObjectDto {
  filterGroups?: FilterGroup[];
  query?: string;
  sorts?: string[];
  properties?: string[];
  limit?: number;
  after?: number;
}

class Filter {
  value?: string;
  highValue?: string;
  values?: string[];
  propertyName: string;
  operator: string;
}

class FilterGroup {
  filters: Filter[];
}
