import { Col, Input, Row, Table } from "antd";
import React, { useEffect, useState, useCallback } from "react";

import { getPeopleList, Person } from "./api";
import columns from "./columns";

import "./App.css";

/* TODO: Implement debouncer */
let timer: NodeJS.Timeout | undefined;
function debounce(func: () => void, wait: number) {
  return () => {
    /* TODO */
    clearTimeout(timer);
    timer = setTimeout(()=> func(), wait);
  };
}

function App() {
  const [ data, setData ] = useState<Person[]>([]);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ input, setInput ] = useState('');
  const [ copyData, setCopyData ] = useState<Person[]>([]);

  const filter = useCallback(() => {
    /* TODO: Implement search filter */
    setData((prev) => 
      copyData.filter((person)=>{
        return(
          person.firstname.toLowerCase().includes(input.toLowerCase())
        )
      })
    )
  }, [input, copyData]);

  const debouncedFilter = useCallback(() =>{
    debounce(filter, 1000)();
  }, [ filter ]);

  const fetchPeople = useCallback(() => {
    setIsLoading(true);
    getPeopleList()
      .then(response => {
        setCopyData(response);
        setData(response);
        setIsLoading(false);
      })
      .catch((e) => console.error(e));
  }, []);

  const handleChange = (e) => {
    setInput(e.target.value)
  }

  useEffect(() => {
    fetchPeople();
  }, [fetchPeople]);

  useEffect(()=>{
    debouncedFilter();
  }, [debouncedFilter])

  return (
    <div className="App">
      <h1>People</h1>
      <Row className="Row">
        <Col>
          <Input allowClear placeholder="search people" onChange={handleChange}/>
        </Col>
      </Row>
      <Table
        bordered={true}
        columns={columns}
        dataSource={data}
        loading={isLoading}
      />
    </div>
  );
}

export default App;
