import axios from "axios";
import type { Session, User } from "../types/location-types";
import type { Folder, Location } from "../types/location-types";

export const locationService = {
  baseUrl: "http://localhost:3000",

  async signup(user: User): Promise<boolean> {
    try {
      const response = await axios.post(`${this.baseUrl}/api/users`, user);
      return response.status === 201 && response.data._id;
    } catch (error) {
      console.error("Error during signup:", error);
      return false;
    }
  },

  async login(email: string, password: string): Promise<Session | null> {
    try {
      const response = await axios.post(`${this.baseUrl}/api/users/authenticate`, {
        email,
        password
      });
      if (response.data.success && response.data.token) {
        //removed bearer token from headers becuase it was causing issues with axios
        axios.defaults.headers.common["Authorization"] = response.data.token;
        const session: Session = {
          name: response.data.name,
          token: response.data.token,
          _id: response.data._id
        };
        return session;
      }
      return null;
    } catch (error) {
      console.error("Error during login:", error);
      return null;
    }
  },

  async location(location: Location, token: string) {
    try{
        axios.defaults.headers.common["Authorization"] = token;
        const response = await axios.post(this.baseUrl + "/api/folders/" +  location.folder + "/locations", location);
        return response.status === 201 && response.data._id;
    } catch (error) {
        console.error("Error during location creation:", error);
        return false;
    }
  },

  async createFolder(folder: { name: string }, token: string): Promise<Folder | null> {
    try {
        axios.defaults.headers.common["Authorization"] = token;
        const response = await axios.post(`${this.baseUrl}/api/folders`, {title: folder.name});
        return response.status === 201 ? response.data : null;
    } catch (error) {
        console.error("Error creating folder:", error);
        return null;
    }
  },

  async getFolders (token: string): Promise<Folder[]> {
    try {
      axios.defaults.headers.common["Authorization"] = token;
      const response = await axios.get(`${this.baseUrl}/api/folders`);
      return response.data.folders || [];
    } catch (error) {
      console.error("Error finding folders:", error);
      return [];
    }
  },

  async deleteFolder(folderId: string, token: string): Promise<boolean> {
    try {
      axios.defaults.headers.common["Authorization"] = token;
      const response = await axios.delete(`${this.baseUrl}/api/folders/${folderId}`);
      return response.status === 204; // No Content status indicates successful deletion
    } catch (error) {
      console.error("Error deleting folder:", error);
      return false;
    }
  },

  async createLocation(folderId: string, location: Omit<Location, '_id' | 'folderid'>, token: string): Promise<Location | null> {
    try {
      axios.defaults.headers.common["Authorization"] = token;
      const response = await axios.post(`${this.baseUrl}/api/folders/${folderId}/locations`, location);
      return response.status === 201 ? response.data : null;
    } catch (error) {
      console.error("Error creating location:", error);
      return null;
    }
  },

  async getLocations(token: string): Promise<Location[]> {
    try {
      axios.defaults.headers.common["Authorization"] = token;
      const response = await axios.get(`${this.baseUrl}/api/locations`);
      return response.data || [];
    } catch (error) {
      console.error("Error finding locations:", error);
      return [];
    }
  },

  async getLocation(locationId: string, token: string): Promise<Location[]> {
    try {
      axios.defaults.headers.common["Authorization"] = token;
      const response = await axios.get(`${this.baseUrl}/api/locations/${locationId}`);
      return response.data || [];
    } catch (error) {
      console.error("Error finding location:", error);
      return [];
    }
  },

  async deleteLocation(locationId: string, token: string): Promise<boolean> {
    try {
      axios.defaults.headers.common["Authorization"] = token;
      const response = await axios.delete(`${this.baseUrl}/api/locations/${locationId}`);
      return response.status === 204; // No Content status indicates successful deletion
    } catch (error) {
      console.error("Error deleting location:", error);
      return false;
    }
  }
};
