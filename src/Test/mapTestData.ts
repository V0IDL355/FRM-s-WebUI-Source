const player = [
    {
      ID: 0,
      PlayerName: "GalaxyVOID",
      ClassName: "",
      location: {
        x: -92569.3203125,
        y: -122266.9375,
        z: -964.68499755859375,
        rotation: 9,
      },
      PlayerHP: Math.random() * 100,
      Dead: true,
      PingTime: Math.random() * 100,
      MapArea: "",
      TagColor: {
        R: 0,
        G: 0,
        B: 0,
        A: 0,
      },
      features: {
        properties: {
          name: "",
          type: "Player",
        },
        geometry: {
          coordinates: {
            X: -92569.3203125,
            Y: -122266.9375,
            Z: -964.68499755859375,
          },
          type: "Point",
        },
      },
    },
    {
      ID: 1,
      PlayerName: "porisius",
      ClassName: "",
      location: {
        x: -92278.453125,
        y: -121765.703125,
        z: -984.6280517578125,
        rotation: 345,
      },
      PlayerHP: Math.random() * 100,
      Dead: false,
      PingTime: Math.random() * 100,
      MapArea: "",
      TagColor: {
        R: 0.0051819998770952225,
        G: 0.39157301187515259,
        B: 0.25415199995040894,
        A: 1,
      },
      features: {
        properties: {
          name: "porisius",
          type: "Player",
        },
        geometry: {
          coordinates: {
            X: -92278.453125,
            Y: -121765.703125,
            Z: -984.6280517578125,
          },
          type: "Point",
        },
      },
    },
];
  
const drone = [
    {
      ID: 0,
      Name: "Drone",
      ClassName: "BP_DroneTransport_C_2147138365",
      location: {
        x: -56065.14453125,
        y: -156554.703125,
        z: 1550.282958984375,
        rotation: 10,
      },
      CurrentDestination: "Storage Import 2",
      HomeStation: "Aluminium Drone",
      FlyingSpeed: Math.random() * 100,
      CurrentFlyingMode: 5.0609362990541046e18,
      features: {
        properties: {
          name: "Drone",
          type: "Drone",
        },
        geometry: {
          coordinates: {
            X: -56065.14453125,
            Y: -156554.703125,
            Z: 1550.282958984375,
          },
          type: "Point",
        },
      },
    },
    {
      ID: 1,
      Name: "Drone",
      ClassName: "BP_DroneTransport_C_2147201133",
      location: {
        x: -81024.140625,
        y: -146122.15625,
        z: 3992.3212890625,
        rotation: 255,
      },
      CurrentDestination: "Battery Import",
      HomeStation: "Battery Port",
      FlyingSpeed: Math.random() * 100,
      CurrentFlyingMode: 5.0609362990541046e18,
      features: {
        properties: {
          name: "Drone",
          type: "Drone",
        },
        geometry: {
          coordinates: {
            X: -81024.140625,
            Y: -146122.15625,
            Z: 3992.3212890625,
          },
          type: "Point",
        },
      },
    },
]
  
const train = [
    {
      Name: "Caterium Choo",
      location: {
        x: -40870.9765625,
        y: -134480.453125,
        z: 8189.84228515625,
        rotation: 280,
      },
      ForwardSpeed: 14.194183349609375,
      TotalMass: 300000,
      PayloadMass: 0,
      PowerConsumed: 25,
      TrainStation: "Quickwire Central",
      ThrottlePercent: 0,
      Derailed: false,
      PendingDerail: false,
      Status: "Self-Driving",
      TimeTable: [
        {
          StationName: "Caterium Ore",
        },
        {
          StationName: "Quickwire Central",
        },
      ],
      features: {
        properties: {
          name: "Caterium Choo",
          type: "Train",
        },
        geometry: {
          coordinates: {
            X: -40870.9765625,
            Y: -134480.453125,
            Z: 8189.84228515625,
          },
          type: "Point",
        },
      },
    },
]
  
const vehicles = [
    {
      Name: "Truck",
      ClassName: "BP_Truck_C",
      PathName: "test1",
      location: {
        x: -49127.796875,
        y: 245541.671875,
        z: -3604.520263671875,
        rotation: 15,
      },
      Status: "",
      CurrentGear: 0,
      ForwardSpeed: 0,
      EngineRPM: 0,
      ThrottlePercent: 0,
      Airborne: false,
      AutoPilot: true,
      FollowingPath: true,
      Storage: [],
      Fuel: [
        {
          Name: "Coal",
          ClassName: "Desc_Coal_C",
          Amount: 97,
        },
      ],
      features: {
        properties: {
          name: "Truck",
          type: "Truck",
        },
        geometry: {
          coordinates: {
            X: -49127.796875,
            Y: 245541.671875,
            Z: -3604.520263671875,
          },
          type: "Point",
        },
      },
    },
    {
      Name: "Truck",
      ClassName: "BP_Truck_C",
      PathName: "test1",
      location: {
        x: -56921.34765625,
        y: 269924.53125,
        z: -3895.547119140625,
        rotation: 166,
      },
      Status: "",
      CurrentGear: 0,
      ForwardSpeed: 0,
      EngineRPM: 0,
      ThrottlePercent: 0,
      Airborne: false,
      AutoPilot: false,
      FollowingPath: false,
      Storage: [],
      Fuel: [
        {
          Name: "Solid Biofuel",
          ClassName: "Desc_Biofuel_C",
          Amount: 9,
        },
      ],
      features: {
        properties: {
          name: "Truck",
          type: "Truck",
        },
        geometry: {
          coordinates: {
            X: -56921.34765625,
            Y: 269924.53125,
            Z: -3895.547119140625,
          },
          type: "Point",
        },
      },
    },
    {
      Name: "Tractor",
      ClassName: "BP_Tractor_C",
      PathName: "test1",
      location: {
        x: -117275.8515625,
        y: 115210.09375,
        z: 7406.97314453125,
        rotation: 90,
      },
      Status: "",
      CurrentGear: 0,
      ForwardSpeed: 0,
      EngineRPM: 0,
      ThrottlePercent: 0,
      Airborne: false,
      AutoPilot: false,
      FollowingPath: false,
      Storage: [],
      Fuel: [],
      features: {
        properties: {
          name: "Tractor",
          type: "Tractor",
        },
        geometry: {
          coordinates: {
            X: -117275.8515625,
            Y: 115210.09375,
            Z: 7406.97314453125,
          },
          type: "Point",
        },
      },
    },
    {
      Name: "Explorer",
      ClassName: "BP_Explorer_C",
      PathName: "test1",
      location: {
        x: -117327.40625,
        y: 115698.9453125,
        z: 7468.6015625,
        rotation: 90,
      },
      Status: "",
      CurrentGear: 0,
      ForwardSpeed: 0,
      EngineRPM: 0,
      ThrottlePercent: 0,
      Airborne: false,
      AutoPilot: false,
      FollowingPath: false,
      Storage: [],
      Fuel: [],
      features: {
        properties: {
          name: "Explorer",
          type: "Explorer",
        },
        geometry: {
          coordinates: {
            X: -117327.40625,
            Y: 115698.9453125,
            Z: 7468.6015625,
          },
          type: "Point",
        },
      },
    },
    {
      Name: "Cyber Wagon",
      ClassName: "Testa_BP_WB_C",
      PathName: "test1",
      location: {
        x: -118022.7421875,
        y: 115367.7265625,
        z: 7397.3662109375,
        rotation: 90,
      },
      Status: "",
      CurrentGear: 0,
      ForwardSpeed: 0,
      EngineRPM: 0,
      ThrottlePercent: 0,
      Airborne: false,
      AutoPilot: false,
      FollowingPath: false,
      Storage: [],
      Fuel: [],
      features: {
        properties: {
          name: "Cyber Wagon",
          type: "Cyber Wagon",
        },
        geometry: {
          coordinates: {
            X: -118022.7421875,
            Y: 115367.7265625,
            Z: 7397.3662109375,
          },
          type: "Point",
        },
      },
    },
]
  
const radarTower = [
    {
      Name: "Radar Tower",
      ClassName: "Build_RadarTower_C_2147374116",
      location: {
        X: -64181.77734375,
        Y: -138709.890625,
        Z: 10639.4453125,
      },
      Fauna: [
        {
          Name: "Small Desert Spitter",
          ClassName: "Desc_SpitterDesert_Small_C",
          Remaining: 1,
        },
        {
          Name: "Fluffy-tailed Hog",
          ClassName: "Desc_HogBasic_C",
          Remaining: 1,
        },
        {
          Name: "Non-flying Birb",
          ClassName: "Desc_NonflyingBird_C",
          Remaining: 1,
        },
        {
          Name: "Alpha Forest Spitter",
          ClassName: "Desc_SpitterForest_Alpha_C",
          Remaining: 1,
        },
        {
          Name: "Unknown File Error #6265616e",
          ClassName: "Desc_SpaceGiraffe_C",
          Remaining: 1,
        },
        {
          Name: "Lizard Doggo",
          ClassName: "Desc_SpaceRabbit_C",
          Remaining: 1,
        },
        {
          Name: "Small Forest Spitter",
          ClassName: "Desc_SpitterForest_Small_C",
          Remaining: 1,
        },
        {
          Name: "Alpha Stinger",
          ClassName: "Desc_StingerAlpha_C",
          Remaining: 1,
        },
        {
          Name: "Small Stinger",
          ClassName: "Desc_StingerSmall_C",
          Remaining: 1,
        },
        {
          Name: "Small Aquatic Spitter",
          ClassName: "Desc_SpitterAquatic_Small_C",
          Remaining: 1,
        },
        {
          Name: "Alpha Hog",
          ClassName: "Desc_HogAlpha_C",
          Remaining: 1,
        },
        {
          Name: "Alpha Desert Spitter",
          ClassName: "Desc_SpitterDesert_Alpha_C",
          Remaining: 1,
        },
      ],
      Signal: [
        {
          Name: "Somersloop WIP",
          ClassName: "Desc_WAT1_C",
          Remaining: 13,
        },
        {
          Name: "Blue Power Slug",
          ClassName: "Desc_Crystal_C",
          Remaining: 59,
        },
        {
          Name: "Mercer Sphere WIP",
          ClassName: "Desc_WAT2_C",
          Remaining: 10,
        },
        {
          Name: "Hard Drive",
          ClassName: "Desc_HardDrive_C",
          Remaining: 1,
        },
      ],
      Flora: [
        {
          Name: "Berry Bush Plant",
          ClassName: "Desc_BerryBush_C",
          Remaining: 1,
        },
        {
          Name: "Nut Bush Plant",
          ClassName: "Desc_NutBush_C",
          Remaining: 1,
        },
        {
          Name: "Bacon Agaric",
          ClassName: "Desc_Shroom_C",
          Remaining: 1,
        },
      ],
      features: {
        properties: {
          name: "Radar Tower",
          type: "Radar Tower",
        },
        geometry: {
          coordinates: {
            X: -64181.77734375,
            Y: -138709.890625,
            Z: 10639.4453125,
          },
          type: "Point",
        },
      },
    },
]
  
const spaceElevator = [
    {
      Name: "Space Elevator",
      ClassName: "Build_SpaceElevator_C",
      location: {
        x: -52637.3046875,
        y: 221160.65625,
        z: -735.436767578125,
        rotation: 40,
      },
      inventory: [],
      PhaseCost: [
        {
          Name: "Smart Plating",
          ClassName: "Desc_SpaceElevatorPart_1_C",
          Amount: 25,
        },
      ],
      FullyUpgraded: false,
      UpgradeReady: false,
      features: {
        properties: {
          name: "Space Elevator",
          type: "Space Elevator",
        },
        geometry: {
          coordinates: {
            X: -52637.3046875,
            Y: 221160.65625,
            Z: -735.436767578125,
          },
          type: "Point",
        },
      },
    },
]
  
const powerSlug = [
    {
      ID: 0,
      SlugType: "Blue Slug",
      ClassName: "BP_Crystal129",
      location: {
        x: 241707.46875,
        y: -310696.75,
        z: 6774.1396484375,
        rotation: 92,
      },
      features: {
        properties: {
          name: "Blue Slug",
          type: "Power Slug",
        },
        geometry: {
          coordinates: {
            X: 241707.46875,
            Y: -310696.75,
            Z: 6774.1396484375,
          },
          type: "Point",
        },
      },
    },
]
  
const truckStation = [
    {
      ID: 0,
      Name: "Truck Station",
      ClassName: "Build_TruckStation_C_2147429525",
      location: {
        x: -87597.640625,
        y: -120560.0078125,
        z: -977.898193359375,
        rotation: 270,
      },
      DockVehicleCount: 0,
      LoadMode: "Load",
      TransferRate: 0,
      MaxTransferRate: 0,
      StationStatus: 4,
      FuelRate: 0,
      StationActivity: "Idle",
      Storage: [],
      Inventory: [],
      features: {
        properties: {
          name: "Truck Station",
          type: "Truck Station",
        },
        geometry: {
          coordinates: {
            X: -87597.640625,
            Y: -120560.0078125,
            Z: -977.898193359375,
          },
          type: "Point",
        },
      },
    },
]

const trainStation = [
    {
      Name: "Caterium Ore",
      location: {
        x: -15742.4189453125,
        y: -110549.765625,
        z: 10589.841796875,
        rotation: 100,
      },
      TransferRate: 5.4957275390625,
      InflowRate: 0,
      OutflowRate: 0,
      LoadingMode: "Loading",
      LoadingStatus: "Loading",
      DockingStatus: 2,
      features: {
        properties: {
          name: "Caterium Ore",
          type: "Train",
        },
        geometry: {
          coordinates: {
            X: 0,
            Y: 0,
            Z: 0,
          },
          type: "Point",
        },
      },
    },
]
  
const drStation = [
    {
      Name: "Drone Port 1",
      ClassName: "Build_DroneStation_C",
      location: {
        x: -30655.7890625,
        y: 221870.6875,
        z: -40.6326904296875,
        rotation: 170,
      },
      PairedStation: "Drone Port 2",
      ConnectedStations: [{ StationName: "Drone Port 2" }],
      DroneStatus: "En Route",
      AvgIncRate: 31,
      AvgIncStack: 0.15648934245109558,
      AvgOutRate: 10.558316230773926,
      AvgOutStack: 0.05279158428311348,
      AvgRndTrip: "00:02:39",
      AvgTotalIncRate: Math.random() * 100,
      AvgTotalIncStack: 0.2999657988548279,
      AvgTotalOutRate: Math.random() * 100,
      AvgTotalOutStack: 0.10635612905025482,
      AvgTripIncAmt: 83,
      EstRndTrip: "00:01:50",
      EstTotalTransRate: 9.745059967041016,
      EstTransRate: 4.872529983520508,
      EstLatestTotalIncStack: 0.2999657988548279,
      EstLatestTotalOutStack: 0.10635612905025482,
      LatestIncStack: 0.15648934245109558,
      LatestOutStack: 0.05279158428311348,
      LatestRndTrip: "00:02:39",
      LatestTripIncAmt: 83,
      LatestTripOutAmt: 28,
      MedianRndTrip: "00:02:39",
      MedianTripIncAmt: 83,
      MedianTripOutAmt: 28,
      EstBatteryRate: Math.random() * 100,
      features: {
        properties: { name: "Drone Port", type: "Drone Station" },
        geometry: {
          coordinates: {
            X: -30655.7890625,
            Y: 221870.6875,
            Z: -40.6326904296875,
          },
          type: "Point",
        },
      },
    },
  ]
  
export { spaceElevator, player, train, powerSlug, truckStation, drone , vehicles, radarTower ,trainStation, drStation};