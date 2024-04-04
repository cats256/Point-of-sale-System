export const buttonWithImg = (text, panel, panelName = '', img = '', alt = '') => (
    <Button
        variant="outlined"
        onClick={() => {
            setPanel(panelName || text);
            setCurrType(text);
        }}
        style={{
            backgroundColor: currType === text ? "#C2A061" : '',
            color: currType === text ? "white" : '',
            marginRight: 8,
        }}
    >
        {img && <img src={img} alt={alt} style={{ marginRight: 8 }} />}
        {text}
    </Button>
);