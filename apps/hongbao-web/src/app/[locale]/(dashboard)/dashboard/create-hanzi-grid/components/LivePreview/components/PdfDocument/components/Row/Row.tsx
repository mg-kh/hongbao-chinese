import { RowField } from "@/app/[locale]/(dashboard)/dashboard/create-hanzi-grid/schemas/CreateHanziGridSchema";
import { Path, Svg, Text, View } from "@react-pdf/renderer";
import HanziWriter from "hanzi-writer";
import React, { useEffect, useState } from "react";
import style from "../../pdf.style";

type StrokeMap = Record<string, string[]>;
const columnCount = 15;

interface RowProps {
  row: RowField;
}

const Row: React.FC<RowProps> = ({ row }) => {
  const [strokeMap, setStrokeMap] = useState<StrokeMap>({});

  useEffect(() => {
    const load = async () => {
      const chars = row.text || "";
      const uniqueChars = Array.from(new Set(chars.split("")));
      const result: StrokeMap = {};

      for (const char of uniqueChars) {
        if (!char.trim()) continue;

        try {
          const data = await HanziWriter.loadCharacterData(char);
          // @ts-ignore
          result[char] = data.strokes;
        } catch {
          console.warn("Failed loading:", char);
        }
      }

      setStrokeMap(result);
    };

    if (row?.text) load();
  }, [row]);

  const strokes = strokeMap[row.text] || [];
  const total = Math.max(columnCount, strokes.length || columnCount);
  const rows = Math.ceil(total / columnCount);

  const renderSVG = (strokes: string[], step?: number, fill?: string) => {
    const visible = step ? strokes.slice(0, step) : strokes;

    return (
      <Svg viewBox="0 0 1024 1024" style={style.svg}>
        {visible.map((d, i) => (
          <Path key={i} d={d} fill={i + 1 === step ? "#dd3631" : "black"} />
        ))}
      </Svg>
    );
  };

  return (
    <>
      <View style={style.row_wrapper}>
        {/* Meaning */}
        <View style={style.meaning_contianer}>
          <View>
            <Text style={style.meaning_text}>
              <Text style={{ ...style.chines_font }}>{row.text || "-"}</Text> |{" "}
              <Text style={{ ...style.chines_font }}>{row.phinyin || "-"}</Text>
            </Text>
          </View>
          <View>
            <Text style={style.meaning_text}>
              {strokes?.length || 0} strokes
            </Text>
          </View>
        </View>
        <View style={style.row_container}>
          <View style={{ gap: 1 }}>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <View key={rowIndex} style={{ flexDirection: "row", gap: 1 }}>
                {Array.from({ length: columnCount }).map((_, colIndex) => {
                  const i = rowIndex * columnCount + colIndex;

                  return (
                    <View key={i} style={style.row_cell}>
                      {!strokes.length ? (
                        <Text style={{ fontSize: 40 }}>{row.text}</Text>
                      ) : (
                        <>
                          <View
                            style={{
                              width: "100%",
                              height: "0px",
                              position: "absolute",
                              borderTop: "1px dashed #e8eaed",
                              borderStyle: "dashed",
                            }}
                          />
                          <View
                            style={{
                              width: "0px",
                              height: "100%",
                              position: "absolute",
                              borderLeft: "1px dashed #e8eaed",
                              borderStyle: "dashed",
                            }}
                          />
                          <View
                            style={{
                              width: "0px",
                              height: "130%",
                              position: "absolute",
                              borderLeft: "1px dashed #e8eaed",
                              borderStyle: "dashed",
                              transform: "rotate(135deg)",
                            }}
                          />
                          <View
                            style={{
                              width: "0px",
                              height: "130%",
                              position: "absolute",
                              borderLeft: "1px dashed #e8eaed",
                              borderStyle: "dashed",
                              transform: "rotate(45deg)",
                            }}
                          />

                          {/* Background strokes */}
                          {i + 1 > strokes.length && (
                            <Svg viewBox="0 0 1024 1024" style={style.svg}>
                              {strokes.map((d, j) => (
                                <Path key={j} d={d} fill="#d4d4d4" />
                              ))}
                            </Svg>
                          )}

                          {/* Step strokes */}
                          {i < strokes.length && renderSVG(strokes, i + 1)}
                        </>
                      )}
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
        </View>
        {/* For Phinyin Training */}
        <View style={{ flexDirection: "row", gap: 1, marginTop: "5px" }}>
          {Array(columnCount)
            .fill("")
            .map((_v, i) => {
              return (
                <View
                  key={i}
                  style={{ ...style.phinyin_row_cell, ...style.chines_font }}
                >
                  <View
                    style={{
                      width: "100%",
                      height: "0px",
                      position: "absolute",
                      borderTop: "1px dashed #e8eaed",
                      borderStyle: "dashed",
                      zIndex: -1,
                      transform: "translateY(-1px)",
                    }}
                  />
                  <View
                    style={{
                      width: "100%",
                      height: "0px",
                      position: "absolute",
                      borderTop: "1px dashed #e8eaed",
                      borderStyle: "dashed",
                      zIndex: -1,
                      transform: "translateY(4.5px)",
                    }}
                  />

                  <Text
                    style={{
                      color: i === 0 ? "black" : "#d4d4d4",
                      fontSize: "12px",
                    }}
                  >
                    {row.phinyin}
                  </Text>
                </View>
              );
            })}
        </View>
        {/* For Training */}
        <View style={{ flexDirection: "row", gap: 1, marginTop: "5px" }}>
          {Array(columnCount)
            .fill("")
            .map((_v, i) => {
              return (
                <View key={i} style={style.row_cell}>
                  <View style={style.svg} />
                  <View
                    style={{
                      width: "0px",
                      height: "100%",
                      position: "absolute",
                      borderLeft: "1px dashed #e8eaed",
                      borderStyle: "dashed",
                      zIndex: -1,
                    }}
                  />
                  <View
                    style={{
                      width: "0px",
                      height: "130%",
                      position: "absolute",
                      borderLeft: "1px dashed #e8eaed",
                      borderStyle: "dashed",
                      transform: "rotate(135deg)",
                      zIndex: -1,
                    }}
                  />
                  <View
                    style={{
                      width: "0px",
                      height: "130%",
                      position: "absolute",
                      borderLeft: "1px dashed #e8eaed",
                      borderStyle: "dashed",
                      transform: "rotate(45deg)",
                      zIndex: -1,
                    }}
                  />
                  <Svg viewBox="0 0 1024 1024" style={style.svg}>
                    {strokes.map((d, j) => (
                      <Path
                        key={j}
                        d={d}
                        fill={i === 0 ? "black" : "#d4d4d4"}
                      />
                    ))}
                  </Svg>
                </View>
              );
            })}
        </View>
      </View>
    </>
  );
};

export default Row;
