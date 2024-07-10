import React, { useState } from "react";
interface IProps {
  open?: boolean;
  children: any;
  title: string;
}

const Collapsible: React.FC<IProps> = ({ open, children, title }) => {
  const [isOpen, setIsOpen] = useState(open);

  const handleFilterOpening = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <div className="card">
        <div>
          <div className="p-3 border-bottom d-flex justify-content-between">
            <h6 className="font-weight-bold">{title}</h6>
            <button type="button" className="btn" onClick={handleFilterOpening}>
              {!isOpen ? (
                <img src="/assets/chevron-down.svg"></img>
              ) : (
                <img src="/assets/chevron-up.sfg"></img>
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