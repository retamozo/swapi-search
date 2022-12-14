import React, {
  ChangeEvent,
  FocusEvent,
  FunctionComponent,
  RefObject,
} from "react";
import "./styles.css";

interface InputProps {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  ref: RefObject<HTMLInputElement> | null;
  placeholder?: string;
}

const SearchInput: FunctionComponent<InputProps> = ({
  onChange,
  onFocus = () => {},
  ref,
  placeholder = "search...",
}) => {
  return (
    <input
      className="search-input"
      type="text"
      onChange={onChange}
      onFocus={onFocus}
      placeholder={placeholder}
      ref={ref}
    />
  );
};

export default SearchInput;
