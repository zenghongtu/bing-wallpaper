# bing-wallpaper

A RESTful API for Bing wallpaper to use easy.

<img width="800" src="https://bingw.jasonzeng.dev/?w=800"/>

> `<img src="https://bingw.jasonzeng.dev/?w=800"/>`

## Usage

### API

Endpoint: [https://bingw.jasonzeng.dev](https://bingw.jasonzeng.dev/)

### Parameters

#### resolution

The resolution of wallpaper image. Default is `1920x1080`.

Option values:

- `UHD`
- `1920x1200`
- `1920x1080`
- `1366x768`
- `1280x768`
- `1024x768`
- `800x600`
- `800x480`
- `768x1280`
- `720x1280`
- `640x480`
- `480x800`
- `400x240`
- `320x240`
- `240x320`

#### format

The response format, can be `json`. **If not set, it will be redirected to the wallpaper image directly**.

#### index

The index of wallpaper, starts from 0. By default, `0` means to get today's image, `1` means to get the image of yesterday, and so on. Negative number is reverse sort, `-1` will get the earliest wallpaper. Or you can specify it as `random` to choose a random index.

#### date

Get wallpaper by date, from `20170101` to today (format is `YYYYMMDD`).

#### w

The width of the wallpaper.

#### h

The height of the wallpaper.

#### qlt

The quality of wallpaper, from `0` to `100`.

### Example

- Request

```text
http://bingw.jasonzeng.dev?resolution=UHD&index=random&w=1000&format=json
```

- Response

```json
{
	"startdate": "20220105",
	"copyright": "Plate-billed mountain toucan in Bellavista Cloud Forest Reserve, Ecuador (© Tui De Roy/Minden Pictures)",
	"urlbase": "/th?id=OHR.MountainToucan_EN-US7120632569",
	"title": "A plate-billed mountain toucan",
	"url": "https://www.bing.com/th?id=OHR.MountainToucan_EN-US7120632569_UHD.jpg&w=1000"
}
```

### CSS background image

You can also use this API to set CSS background image:

```text
background-image: url(https://bingw.jasonzeng.dev/?index=random);
height: 100%;
background-position: center;
background-repeat: no-repeat;
background-size: cover;
```

**Demo**

[https://blog.jasonzeng.dev/](https://blog.jasonzeng.dev/)

## Development

```
pnpm run dev
```

## Related

- [TimothyYe/bing-wallpaper](https://github.com/TimothyYe/bing-wallpaper) - A RESTful API to fetch daily wallpaper from Bing.com
