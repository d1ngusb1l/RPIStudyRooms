import React, { useState } from "react";

import chevronDown from "./assets/chevron-down.svg";
import chevronUp from "./assets/chevron-up.svg";
interface IProps {
  open?: boolean;
}

const Collapsible: React.FC<React.PropsWithChildren<IProps>> = ({ open, children}) => {
  const [isOpen, setIsOpen] = useState(open);

  const handleFilterOpening = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <div className="card">
        <div>
          <div className="p-3 border-bottom d-flex justify-content-between">
            <button type="button"
              className="btn"
              onClick={handleFilterOpening}
              style={{ width: '300px', height: '50px' }}
            >
              {!isOpen ? (
                <img src={chevronDown} alt="expand" style={{ width: '100%', height: '100%' }} />
              ) : (
                <img src={chevronUp} alt="collapse" style={{ width: '100%', height: '100%' }} />
              )}
            </button>
          </div>
        </div>

        <div className="border-bottom">
          <div>{isOpen && <div className="p-3">{children}</div>}</div>
        </div>
      </div>
    </>
  );
};

export default Collapsible;