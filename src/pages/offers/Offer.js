import React, { useState, useEffect } from "react";
import { Row } from "react-bootstrap";
import SearchOffer from "./SearchOffer";
import TableOffers from "./TableOffers";
import "../../assets/css/offer-css/offer.css";
import ApiService from "../../services/serviceApiOffer";
import Pagination from "~/components/common/Pagination";
import ButtonOffer from "./ButtonOffer";
import { fetchAllCandidate } from "~/services/candidateApi";

export default function Offer() {
  const [dataOffer, setDataOffer] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [candidate, setCandidate] = useState([]);
  const itemsPerPage = 10;
  const handleSearch = (query, dept, stat) => {
    setSearchQuery(query);
    setDepartment(dept);
    setStatus(stat);
    setCurrentPage(1);
  };

  const loadDataOffer = async () => {
    setLoading(true);
    try {
      const response = await ApiService.ApiOffer();
      setDataOffer(response.data);
      const responeCan = await fetchAllCandidate();
      setCandidate(responeCan.data);
    } catch (error) {
      console.error("Error loading offers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDataOffer();
  }, []);

  const filterOffer = dataOffer.filter((item) => {
    const searchMatch =
      !searchQuery ||
      (item.candidate &&
        Object.values(item.candidate).some((name) =>
          name?.toLowerCase().includes(searchQuery.toLowerCase())
        ));

    const statusMatch = !status || item.offerStatus?.includes(status);

    const departmentMatch =
      !department ||
      item.department?.toLowerCase().includes(department.toLowerCase());

    return searchMatch && statusMatch && departmentMatch;
  });

  const handlePageChange = (page) => {
    if (page > 0 && page <= Math.ceil(filterOffer.length / itemsPerPage)) {
      setCurrentPage(page);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayOffers = filterOffer.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="App">
      <h5>Offer List</h5>
      <Row>
        <SearchOffer onSearch={handleSearch} />
      </Row>
      <ButtonOffer dataOffer={dataOffer} />
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <TableOffers
            filterOffer={displayOffers}
            candidate={candidate}
            dataOffer={dataOffer}
            currentPage={currentPage}
          />
          <Pagination
            currentPage={currentPage}
            totalItems={Math.ceil(filterOffer.length / itemsPerPage)}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
