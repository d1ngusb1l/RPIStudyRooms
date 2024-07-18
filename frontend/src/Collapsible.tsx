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
            <button type="button" 
            className="btn" 
            onClick={handleFilterOpening}
            style={{ width: '300px', height: '50px' }} 
            >
              {!isOpen ? (
                <img src="/src/assets/chevron-down.svg" alt="expand" style={{ width: '100%', height: '100%' }} />
              ) : (
                <img src="/src/assets/chevron-up.svg" alt="collapse" style={{ width: '100%', height: '100%' }} />
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