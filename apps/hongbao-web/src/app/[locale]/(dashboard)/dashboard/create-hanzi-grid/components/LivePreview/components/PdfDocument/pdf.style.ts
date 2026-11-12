import { StyleSheet } from "@react-pdf/renderer";

const style = StyleSheet.create({
  myanmar_font: {
    fontFamily: "MiSansMyanmar",
  },
  chines_font: {
    fontFamily: "MiSans",
  },
  page: {
    padding: "10px",
    paddingHorizontal: "20px",
    position: "relative",
  },
  watermark_container: {
    position: "absolute",
  },
  header_container: {
    gap: "5px",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  logo_text_container: {
    gap: "5px",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  logo: {
    width: 30,
    height: 30,
  },
  header_row: {},
  header_text: {
    fontSize: "10px",
  },
  row_wrapper: {
    marginTop: "10px",
  },
  meaning_contianer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  meaning_text: {
    fontSize: "10px",
  },
  row_container: {
    flexDirection: "row",
    marginTop: "5px",
    justifyContent: "space-between",
  },
  row_cell: {
    width: "100%",
    height: 36,
    borderWidth: 1,
    borderColor: "#c5c6c7",
    justifyContent: "center",
    alignItems: "center",
    transform: "rotate(180deg) scaleX(-1)",
    flexShrink: 0,
  },
  phinyin_row_cell: {
    width: "100%",
    height: 20,
    borderWidth: 1,
    borderColor: "#c5c6c7",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  svg: {
    position: "absolute",
    width: 25,
    height: 25,
    transform: "translateX(0px) translateY(2px)",
  },
});

export default style;
