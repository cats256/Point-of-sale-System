import { Pagination } from "@mui/material";

const CustomerView = ({ menuItems }) => {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                minHeight: "100vh",
            }}
        >
            <div
                style={{
                    borderRight: "2px solid #000",
                    flexGrow: 2,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <div style={{ flexGrow: 1 }}>Burgers</div>
                <div style={{ flexGrow: 1 }}>Baskets</div>
                <div style={{ flexGrow: 1 }}>Desserts</div>
                <div style={{ flexGrow: 1 }}>Sides</div>
                <div style={{ flexGrow: 1 }}>Drinks</div>
                <div style={{ flexGrow: 1 }}>Sauces</div>
            </div>
            <div
                style={{
                    borderRight: "2px solid #000",
                    flexGrow: 10,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <div style={{ borderBottom: "2px solid #000", flexGrow: 10 }}>
                    <div>{menuItems[0].name}</div>
                    <div>{menuItems[1].name}</div>
                    <div>{menuItems[2].name}</div>
                    <div>{menuItems[3].name}</div>
                </div>
                <Pagination style={{ flexGrow: 1 }} count={10} />
            </div>
            <div style={{ flexGrow: 3 }}>Third Panel</div>
        </div>
    );
};

export { CustomerView };
