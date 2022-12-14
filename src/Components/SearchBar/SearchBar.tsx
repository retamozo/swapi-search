import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import { useKeyDown } from "../../hooks/useKeyDown";
import { getPersonByName } from "../../services/peopleByName";
import { Persons } from "../../types/persons";
import "./styles.css";

type SearchResults = {
  data: Persons[];
  isLoading: boolean;
};

export const SearchBar = () => {
  const [searchResult, setSearchResult] = useState<SearchResults>({
    data: [],
    isLoading: false,
  });

  const [showResults, setShowResults] = useState(false);

  const { data, isLoading } = searchResult;

  const inputRef = useRef<HTMLInputElement>(null);

  const debounce = useDebounce();

  const controllerRef = useRef<AbortController>();

  const itemRef = useRef<HTMLAnchorElement>(null);

  const controller = new AbortController();

  controllerRef.current = controller;

  const onFocus = () => {
    setTimeout(() => setShowResults(true), 500);
  };

  const onBlur = () => {
    setShowResults(false);
  };

  const handleSearch = (input: string) => {
    if (!input) {
      setSearchResult({
        data: [],
        isLoading: false,
      });
    } else {
      debounce(() => {
        setSearchResult((prev) => ({ ...prev, isLoading: true }));
        getPersonByName({
          input,
          controller: controllerRef.current as AbortController,
        })
          .then(({ results }) =>
            setSearchResult((prev) => ({
              ...prev,
              data: results,
              isLoading: false,
            }))
          )
          .catch((e) => {
            console.error(e);
            setSearchResult({
              data: [],
              isLoading: false,
            });
          });
      });
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.trim();
    if (input && input.length > 0) {
      handleSearch(input);
    }
  };

  useEffect(() => {
    return () => {
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, []);

  const { focusIndex, onKeyDown } = useKeyDown({
    optsLength: data.length,
    onEnter: () => itemRef.current?.click(),
  });

  return (
    <div className="search-bar-container">
      <div className="input-container">
        <input
          className="search-input"
          id="search-input"
          data-testid="search-input"
          type="text"
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder="the force may be with you"
          ref={inputRef}
          onKeyDown={onKeyDown}
        />
      </div>
      {isLoading && (
        <div className="loading-container">
          <span>Loading ...</span>
        </div>
      )}
      {!!showResults && !!data.length && !isLoading && (
        <div className="results-container" data-testid="results-container">
          <ul>
            {data.map((val, i) => {
              return (
                <li
                  key={val.name}
                  className="list"
                  style={{
                    backgroundColor: i === focusIndex ? "#ccc" : "transparent",
                  }}
                >
                  <a
                    href={val.homeworld}
                    target="_blank"
                    rel="noreferrer"
                    ref={itemRef}
                  >
                    {val.name}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};
