import React from 'react';
import { Card, Form, Row, Col } from 'react-bootstrap';

export default function Filter({ search, setSearch, yearRange, setYearRange, sortBy, setSortBy }) {
  return (
    <Card className="mb-3 filter-card">
      <Card.Body>
        <Row className="g-2 align-items-end">
          <Col md={6}>
            <Form.Group controlId="searchInput">
              <Form.Label>Search</Form.Label>
              <Form.Control
                type="text"
                placeholder="Search by title, description, genre..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group controlId="yearFilter">
              <Form.Label>Filter by Year</Form.Label>
              <Form.Select value={yearRange} onChange={(e) => setYearRange(e.target.value)}>
                <option value="all">All</option>
                <option value="lte2000">Year ≤ 2000</option>
                <option value="2001-2015">2001 - 2015</option>
                <option value="gt2015">Year &gt; 2015</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group controlId="sortBy">
              <Form.Label>Sort</Form.Label>
              <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="none">-- None --</option>
                <option value="year-asc">Year ↑</option>
                <option value="year-desc">Year ↓</option>
                <option value="title-asc">Title A→Z</option>
                <option value="title-desc">Title Z→A</option>
                <option value="duration-asc">Duration ↑</option>
                <option value="duration-desc">Duration ↓</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
