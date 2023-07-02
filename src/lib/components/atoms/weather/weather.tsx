/* eslint-disable camelcase */
import type { ReactElement } from "react";
import { Text } from "../text";
import { headers } from "next/dist/client/components/headers";
import { z } from "zod";
import Image from "next/image";

type WeatherData = {
  temperature: number;
  icon: number;
}

const METEO_API = "https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true&timeformat=unixtime";

async function getServerSideProps(): Promise<WeatherData | null> {
  const headerList = headers();
  const addr = headerList.get("x-forwarded-for");

  if (addr === null || addr == "::1") return null;

  const reqIP = new Request(`http://ip-api.com/json/${addr}?fields=lat,lon`);

  const schemaIP = z.object({
    lat: z.number(),
    lon: z.number()
  }).safeParse(await (await fetch(reqIP)).json());

  if (!schemaIP.success) return null;
  const data = schemaIP.data;

  const reqWeather = new Request(METEO_API.replace("{lat}", data.lat.toString()).replace("{lon}", data.lon.toString()));

  const schema = z.object({
    latitude: z.number(),
    longitude: z.number(),
    generationtime_ms: z.number(),
    utc_offset_seconds: z.number(),
    timezone: z.string(),
    timezone_abbreviation: z.string(),
    elevation: z.number(),
    current_weather: z.object({
      temperature: z.number(),
      windspeed: z.number(),
      winddirection: z.number(),
      weathercode: z.number(),
      is_day: z.number(),
      time: z.number()
    })
  }).safeParse(await (await fetch(reqWeather)).json());

  if (!schema.success) return null;

  const weatherData = schema.data.current_weather;

  return { icon: weatherData.weathercode, temperature: weatherData.temperature };
}

export const Weather = async(): Promise<ReactElement> => {
  const data = await getServerSideProps();

  return (
    <>
      {data === null ? (
        <></>
      ) : (
        <div className="fixed top-0 left-0 p-3">
          <div className="flex items-center">
            <div>
              <Image
                src={`/weather/${data.icon}.png`}
                quality={5}
                width={48}
                height={48}
                alt="Weather icon"
              />
            </div>
            <div className="ml-3">
              <Text className="text-2xl font-semibold">{Math.round(data.temperature)}°C</Text>
            </div>
          </div>
        </div>
      )}
    </>
  );
};