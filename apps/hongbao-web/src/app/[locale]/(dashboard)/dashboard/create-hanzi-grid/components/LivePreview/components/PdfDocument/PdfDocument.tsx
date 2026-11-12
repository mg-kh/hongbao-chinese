"use client";

import { Document, Font, Image, Page, Text, View } from "@react-pdf/renderer";
import React from "react";
import { PageField } from "../../../../schemas/CreateHanziGridSchema";
import Row from "./components/Row/Row";
import style from "./pdf.style";

Font.register({
  family: "MiSans",
  src: "/assets/fonts/MiSans-Regular.ttf",
});
Font.register({
  family: "MiSansMyanmar",
  src: "/assets/fonts/MiSansMyanmar-Regular.ttf",
});

interface Props {
  website_name: string;
  website_type: string;
  website_url: string;
  pages: PageField[];
}

const PdfDocument: React.FC<Props> = ({
  website_name,
  website_type,
  website_url,
  pages,
}) => {
  return (
    <Document>
      {pages.map((p, i) => {
        return (
          <Page key={i} size="A4" style={style.page}>
            {/* Water Mark */}
            <Text
              style={{
                position: "absolute",
                fontSize: "30px",
                transform: "translateX(0%) translateY(0%)",
                opacity: "0.5",
                left: "5%",
                top: "30%",
                fontWeight: "bold",
                color: "#e8e8e8",
              }}
            >
              HONG BAO CHINESE ONLINE CLASS
            </Text>
            <Text
              style={{
                position: "absolute",
                fontSize: "30px",
                transform: "translateX(0%) translateY(0%)",
                opacity: "0.5",
                left: "5%",
                top: "40%",
                fontWeight: "bold",
                color: "#e8e8e8",
              }}
            >
              HONG BAO CHINESE ONLINE CLASS
            </Text>
            <Text
              style={{
                position: "absolute",
                fontSize: "30px",
                transform: "translateX(0%) translateY(0%)",
                opacity: "0.5",
                left: "5%",
                top: "50%",
                fontWeight: "bold",
                color: "#e8e8e8",
              }}
            >
              HONG BAO CHINESE ONLINE CLASS
            </Text>
            <Text
              style={{
                position: "absolute",
                fontSize: "30px",
                transform: "translateX(0%) translateY(0%)",
                opacity: "0.5",
                left: "5%",
                top: "60%",
                fontWeight: "bold",
                color: "#e8e8e8",
              }}
            >
              HONG BAO CHINESE ONLINE CLASS
            </Text>
            <Text
              style={{
                position: "absolute",
                fontSize: "30px",
                transform: "translateX(0%) translateY(0%)",
                opacity: "0.5",
                left: "5%",
                top: "70%",
                fontWeight: "bold",
                color: "#e8e8e8",
              }}
            >
              HONG BAO CHINESE ONLINE CLASS
            </Text>

            {/* Header */}
            <View style={style.header_container}>
              <View style={style.logo_text_container}>
                <View>
                  <Image src={"/assets/logo.png"} style={style.logo} />
                </View>
                <View>
                  <Text
                    style={{
                      ...style.header_text,
                      fontSize: "15px",
                      fontWeight: "bold",
                      color: "#5c1e1e",
                    }}
                  >
                    {website_name}
                  </Text>
                  <Text style={{ ...style.header_text, color: "#b65039" }}>
                    {website_type}
                  </Text>
                </View>
              </View>
              <Text style={style.header_text}>{i + 1}</Text>
            </View>
            {/* Row */}
            {p?.rows?.map((row, i) => {
              return (
                <React.Fragment key={i}>
                  <Row row={row} />
                </React.Fragment>
              );
            })}
          </Page>
        );
      })}
    </Document>
  );
};

export default PdfDocument;
