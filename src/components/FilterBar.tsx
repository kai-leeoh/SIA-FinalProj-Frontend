import { Button, Col, DatePicker, Input, Row, Segmented } from "antd";
import dayjs from "dayjs";

export interface Filters {
    search: string;
    type: "all" | "crypto" | "etf";
    result: "all" | "gain" | "loss";
    dateFrom: string | null;
    dateTo: string | null;
}

export const DEFAULT_FILTERS: Filters = {
    search: "",
    type: "all",
    result: "all",
    dateFrom: null,
    dateTo: null,
};

interface Props {
    filters: Filters;
    onChange: (filters: Filters) => void;
}

export const FilterBar = ({ filters, onChange }: Props) => {
    const isFiltered =
        filters.search !== "" ||
        filters.type !== "all" ||
        filters.result !== "all" ||
        filters.dateFrom !== null ||
        filters.dateTo !== null;

    return (
        <Row gutter={[12, 12]} align="middle" className="no-print" style={{ marginBottom: 24 }}>
            <Col xs={24} md={8}>
                <Input.Search
                    allowClear
                    placeholder="Search asset"
                    value={filters.search}
                    onChange={(e) => onChange({ ...filters, search: e.target.value })}
                />
            </Col>
            <Col xs={24} sm="auto">
                <Segmented
                    value={filters.type}
                    onChange={(v) => onChange({ ...filters, type: v as Filters["type"] })}
                    options={[
                        { label: "All", value: "all" },
                        { label: "Crypto", value: "crypto" },
                        { label: "Stocks / ETFs", value: "etf" },
                    ]}
                />
            </Col>
            <Col xs={24} sm="auto">
                <Segmented
                    value={filters.result}
                    onChange={(v) => onChange({ ...filters, result: v as Filters["result"] })}
                    options={[
                        { label: "All results", value: "all" },
                        { label: "Gains", value: "gain" },
                        { label: "Losses", value: "loss" },
                    ]}
                />
            </Col>
            <Col xs={24} md="auto">
                <DatePicker.RangePicker
                    style={{ width: "100%" }}
                    placeholder={["Purchased from", "to"]}
                    value={
                        filters.dateFrom || filters.dateTo
                            ? [
                                filters.dateFrom ? dayjs(filters.dateFrom) : null,
                                filters.dateTo ? dayjs(filters.dateTo) : null,
                            ]
                            : null
                    }
                    onChange={(dates) =>
                        onChange({
                            ...filters,
                            dateFrom: dates?.[0]?.format("YYYY-MM-DD") ?? null,
                            dateTo: dates?.[1]?.format("YYYY-MM-DD") ?? null,
                        })
                    }
                />
            </Col>
            <Col xs={24} sm="auto">
                <Button disabled={!isFiltered} onClick={() => onChange(DEFAULT_FILTERS)}>
                    Reset
                </Button>
            </Col>
        </Row>
    );
};
